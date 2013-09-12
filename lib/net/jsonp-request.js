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
 * @constructor
 * @extends {net.Request}
 * @param {string} url Базовый адрес запроса.
 */
net.JsonpRequest = function(url) {
  net.Request.call(this, url);

  /**
   * @type {string}
   */
  this.__id = 'njr_' + (net.JsonpRequest.__lastId += 1);

  /**
   * @type {string}
   */
  this.__callbackName = this.__id + '_callback';

  /**
   * @type {Element}
   */
  this.__script = null;
};

util.inherits(net.JsonpRequest, net.Request);


/**
 * @type {number}
 */
net.JsonpRequest.__lastId = 0;


/**
 * @type {number}
 */
net.JsonpRequest.ERROR_TIMEOUT = 30000;


/**
 * @type {string}
 */
net.JsonpRequest.CALLBACK_TABLE = '__jsonp';


/**
 * @inheritDoc
 */
net.JsonpRequest.prototype._isRunning = function() {
  return this.__script !== null;
};


/**
 * @inheritDoc
 */
net.JsonpRequest.prototype._doSend = function(data, path) {
  var requestURL = this.getUrl() + path;

  if (requestURL.indexOf('?') === -1) {
    requestURL += '?';
  }

  requestURL += util.encodeFormData({
    '__fallback__': '',
    '_m': this.getMethod(),
    '_h': this.getHeaders(),
    '_c': this.__callbackName,
    '_t': 'jsonp',
    '_': data || undefined
  });

  var self = this;

  /**
   * @param {string=} opt_data Данные реузльтата.
   * @param {number=} opt_status Статус реузльтата.
   */
  function callback(opt_data, opt_status) {
    self._handleResult(opt_status === undefined ? 404 : opt_status, opt_data);
  }

  window[this.__callbackName] = callback;

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

  document.body.appendChild(this.__script);
};


/**
 * @inheritDoc
 */
net.JsonpRequest.prototype._reset = function() {
  if (this.__script !== null) {
    this.__script.onreadystatechange = util.nop;
    this.__script.onload = util.nop;

    document.body.removeChild(this.__script);

    try {
      delete window[this.__callbackName];
    } catch (error) {
      window[this.__callbackName] = util.nop;
    }

    this.__script = null;
  }
};
