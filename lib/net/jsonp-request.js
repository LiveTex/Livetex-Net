/**
 * TUNA FRAMEWORK
 *
 * Copyright (c) 2012, Sergey Kononenko
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * * Names of contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL SERGEY KONONENKO BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



/**
 * HTTP-запрос на основе JSONP.
 *
 * @constructor
 * @extends {net.Request}
 * @param {string} url Адрес запроса.
 */
net.JsonpRequest = function(url) {
  net.Request.call(this, url);

  /**
   * @type {string}
   */
  this.__id = net.JsonpRequest.ID_PREFIX + (net.JsonpRequest.__lastId += 1);

  /**
   * @type {Element}
   */
  this.__script = null;
};

util.inherits(net.JsonpRequest, net.Request);


/**
 * Счетчик суффикса идентификатора.
 *
 * @type {number}
 */
net.JsonpRequest.__lastId = 0;


/**
 * Префикс идентификатора.
 *
 * @type {string}
 */
net.JsonpRequest.ID_PREFIX = 'jspr_';


/**
 * Таймаут ошибки загрузки.
 *
 * @type {number}
 */
net.JsonpRequest.ERROR_TIMEOUT = 30000;


/**
 * Ключ таблицы обработчиков в глобальном контексте.
 *
 * @type {string}
 */
net.JsonpRequest.CALLBACK_TABLE = '__jsonp';


/**
 * @inheritDoc
 */
net.JsonpRequest.prototype.abort = function() {
  net.Request.prototype.abort.call(this);

  if (this.__script !== null) {
    window[net.JsonpRequest.CALLBACK_TABLE][this.__id](0);
  }
};


/**
 * @inheritDoc
 */
net.JsonpRequest.prototype._canSend = function() {
  return this.__script === null;
};


/**
 * @inheritDoc
 */
net.JsonpRequest.prototype._doSend = function(path, opt_data) {
  var requestURL = this.getUrl() + path;

  var metaData = {
    '__m': this.getMethod(), // emulate method
    '__c': net.JsonpRequest.CALLBACK_TABLE + '["' + this.__id + '"]'
  };

  if (requestURL.indexOf('?') === -1) {
    requestURL += '?';
  }


  if (opt_data instanceof Object) {
    requestURL += util.encodeFormData(opt_data);
  } else if (opt_data !== undefined) {
    metaData['__p'] = opt_data; // emulate payload
  }

  requestURL += '&__&' + util.encodeFormData(metaData);

  var self = this;
  var timeout = -1;

  /**
   * @param {number=} opt_status Статус результата.
   * @param {string=} opt_data Данные результата.
   */
  function callback(opt_status, opt_data) {
    var status = opt_status === undefined ? 404 : opt_status;
    var data = opt_data || '';

    clearTimeout(timeout);

    self.__handleResult(status, data);
  }

  if (window[net.JsonpRequest.CALLBACK_TABLE] === undefined) {
    window[net.JsonpRequest.CALLBACK_TABLE] = {};
  }

  window[net.JsonpRequest.CALLBACK_TABLE][this.__id] = callback;

  this.__script = document.createElement('SCRIPT');
  this.__script.id = this.__id;
  this.__script.src = requestURL;

  this.__script.onreadystatechange = function() {
    if (self.__script.readyState === 'complete' ||
        self.__script.readyState === 'loaded') {

      callback();
    }
  };

  this.__script.onload = function() {
    callback();
  };

  timeout = setTimeout(callback, net.JsonpRequest.ERROR_TIMEOUT);

  document.body.appendChild(this.__script);
};


/**
 * Обработка завершения запроса.
 *
 * @param {number} status Статут ответа.
 * @param {string} data Данные ответа.
 */
net.JsonpRequest.prototype.__handleResult = function(status, data) {
  this.__script.onreadystatechange = util.nop;
  this.__script.onload = util.nop;

  document.body.removeChild(this.__script);

  this.__script = null;

  delete window[net.JsonpRequest.CALLBACK_TABLE][this.__id];

  if (status !== 0) {
    this._process();

    this.dispatch('complete', new net.RequestData(status, data));
  }
};
