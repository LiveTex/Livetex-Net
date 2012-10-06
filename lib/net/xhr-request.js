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
 * HTTP-запрос на основе базовой реализации XHR.
 *
 * @constructor
 * @extends {net.Request}
 * @param {string} url Адрес запроса.
 */
net.XhrRequest = function(url) {
  net.Request.call(this, url);

  var self = this;

  /**
   * @type {XMLHttpRequest}
   */
  this.__request = null;

  /**
   * @type {!Function}
   */
  this.__handleReadyStateChange = function() {
    if (self.__request !== null &&
        self.__request.readyState === 4) {

      self.__handleResult();
    }
  };
};

util.inherits(net.XhrRequest, net.Request);


/**
 * @inheritDoc
 */
net.XhrRequest.prototype.abort = function() {
  net.Request.prototype.abort.call(this);

  if (this.__request !== null) {
    this.__request.onreadystatechange = util.nop;
    this.__request.abort();
    this.__request = null;
  }
};


/**
 * @inheritDoc
 */
net.XhrRequest.prototype._canSend = function() {
  return this.__request === null;
};


/**
 * @inheritDoc
 */
net.XhrRequest.prototype._doSend = function(path, opt_data) {
  this.__request = this.__createRequest();
  if (this.__request !== null) {

    var sendData = null;
    var requestURL = this.getUrl() + path;
    var requestMethod = this.getMethod();

    var dataString = '';
    if (opt_data instanceof Object) {
      dataString += util.encodeFormData(opt_data);
    } else if (opt_data !== undefined) {
      dataString += opt_data;
    }

    if (requestMethod === net.Request.METHOD_GET && dataString !== '') {
      requestURL += (requestURL.indexOf('?') === -1 ? '?' : '&') + dataString;
    }

    this.__request.onreadystatechange = this.__handleReadyStateChange;
    this.__request.open(requestMethod, encodeURI(requestURL), true);

    if (requestMethod !== net.Request.METHOD_GET) {
      this.__request.setRequestHeader(
          'Content-Type', 'application/x-www-form-urlencoded'
      );

      sendData = dataString;
    } else {
      this.__request.setRequestHeader('Content-Type', 'text/plain');
    }

    this.__request.send(sendData);
  } else {
    console.error('Can\'t create native XMLHttpRequest.');
  }
};


/**
 * Обработка результата запроса.
 */
net.XhrRequest.prototype.__handleResult = function() {
  var status = this.__request.status || 500;
  if (status === 1223) {
    status = 204;
  }

  var data = this.__request.responseText || '';

  this.__request.onreadystatechange = util.nop;
  this.__request = null;

  this._process();

  this.dispatch('complete', new net.RequestData(status, data));
};


/**
 * Создание базового объекта запроса.
 *
 * @return {XMLHttpRequest} Созданный объект запроса.
 */
net.XhrRequest.prototype.__createRequest = function() {
  if (window['XMLHttpRequest'] !== undefined) {
    return new XMLHttpRequest();
  }

  if (window['ActiveXObject'] !== undefined) {
    return new ActiveXObject('Microsoft.XMLHTTP');
  }

  return null;
};
