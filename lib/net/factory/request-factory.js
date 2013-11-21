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
 * Стандартная фабрика HTTP-запросов.
 *
 * @constructor
 * @implements {net.factory.IRequestFactory}
 * @param {string=} opt_hostOrUrl Хост либо адрес.
 * @param {boolean=} opt_isSecure Флаг защищенности соединенияю.
 * @param {number=} opt_port Порт.
 */
net.factory.RequestFactory = function(opt_hostOrUrl, opt_isSecure, opt_port) {

  /**
   * @type {string}
   */
  this.__url = net.makeUrl(opt_hostOrUrl, opt_isSecure, opt_port);

  /**
   * @type {boolean}
   */
  this.__sameDomain =
      this.__url.indexOf(location.protocol + '//' + location.host + '/') === 0;

  /**
   * @type {!Object.<string, string>}
   */
  this.__headers = {};
};


/**
 * @inheritDoc
 */
net.factory.RequestFactory.prototype.createRequest = function(opt_needResult) {
  if (this.__sameDomain || net.CAN_USE_CORS) {
    return new net.XhrRequest(this.__url, !this.__sameDomain);
  }

  if (net.CAN_USE_XDM) {
    return new net.XdmRequest(this.__url);
  }

  if (opt_needResult === undefined || opt_needResult) {
    return new net.JsonpRequest(this.__url);
  }

  return new net.FormRequest(this.__url);
};


/**
 * @param {!Object.<string, string>} headers Значение.
 */
net.factory.RequestFactory.prototype.setHeaders = function(headers) {
  this.__headers = headers;
};


/**
 * @param {string} key Ключ.
 * @param {string} value Значение.
 */
net.factory.RequestFactory.prototype.setHeader = function(key, value) {
  this.__headers[key] = value;
};
