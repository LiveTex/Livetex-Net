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
 * Релизация HTTP-запроса с использованием <code>XMLHttpRequest</code>.
 *
 * @see net.Request
 * @constructor
 * @extends {net.Request}
 * @param {string} url Базовый адрес запроса.
 * @param {boolean=} opt_useCors Использовать ли кроссдоменные куки.
 */
net.XhrRequest = function(url, opt_useCors) {
  net.Request.call(this, url);

  /**
   * @type {XMLHttpRequest}
   */
  this.__request = null;

  /**
   * @type {boolean}
   */
  this.__useCors = opt_useCors || false;
};

util.inherits(net.XhrRequest, net.Request);


/**
 * @inheritDoc
 */
net.XhrRequest.prototype._isRunning = function() {
  return this.__request !== null;
};


/**
 * @inheritDoc
 */
net.XhrRequest.prototype._doSend = function(data, path) {
  this.__request = this.__createRequest();

  if (this.__request !== null) {
    var method = this.getMethod();
    var headers = this.getHeaders();
    var self = this;

    this.__request.onreadystatechange = function() {

      if (self.__request !== null && self.__request.readyState === 4) {
        var data = self.__request.responseText || '';
        var status = self.__request.status;
        if (status === 1223) {
          status = 204;
        }

        self._handleResult(status, data);
      }
    };

    var requestURL = this.getUrl() + path;
    if (method === net.RequestMethod.GET && data.length !== 0) {
      requestURL += (requestURL.indexOf('?') === -1 ? '?' : '&') + data;
    }

    this.__request.open(method, encodeURI(requestURL), true);
    this.__request.withCredentials = false;

    var sendData = null;
    if (method !== net.RequestMethod.GET) {
      this.__request.setRequestHeader('Content-Type',
          'application/x-www-form-urlencoded');

      sendData = data;
    } else {
      this.__request.setRequestHeader('Content-Type', 'text/plain');
    }

    for (var name in headers) {
      this.__request.setRequestHeader(name, headers[name]);
    }

    try {
      this.__request.send(sendData);
    } catch (error) {
      console.error('XHR request error: ' + error.message);
      this._handleResult(500);
    }

  } else {
    console.error('Unable to create instance of XMLHttpRequest.');
    this._handleResult(500);
  }
};


/**
 * Уничтожение текущего объекта запроса.
 */
net.XhrRequest.prototype._reset = function() {
  if (this.__request !== null) {
    this.__request.onreadystatechange = util.nop;
    this.__request.abort();
    this.__request = null;
  }
};


/**
 * Создание экземпляра объекта <code>XMLHttpRequest</code>.
 *
 * @return {XMLHttpRequest} Объект запроса.
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
