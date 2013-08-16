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
 * Стандартная фабрика постоянных соединенйи с сервером.
 *
 * @constructor
 * @implements {net.factory.ISocketFactory}
 * @param {string=} opt_hostOrUrl Хост либо адрес.
 * @param {boolean=} opt_isSecure Флаг защищенности соединенияю.
 * @param {number=} opt_port Порт.
 */
net.factory.SocketFactory = function(opt_hostOrUrl, opt_isSecure, opt_port) {

  /**
   * @type {string}
   */
  this.__url = net.makeUrl(opt_hostOrUrl, opt_isSecure, opt_port, 'ws');
};


/**
 * @inheritDoc
 */
net.factory.SocketFactory.prototype.createSocket = function(opt_headers) {
  try {
    var url = this.__url;

    for (var name in opt_headers) {
      url += (url.indexOf('?') === -1 ? '?' : '&') +
          '_h[' + name + ']=' + opt_headers[name];
    }

    if (window['WebSocket'] !== undefined) {
      return new WebSocket(url);
    } else if (window['MozWebSocket'] !== undefined) {
      return new window['MozWebSocket'](url);
    }
  } catch (error) {}

  return null;
};
