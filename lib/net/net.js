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
 * @namespace
 */
var net = {};


/**
 * @namespace
 */
net.factory = {};


/**
 * @type {boolean}
 */
net.CAN_USE_CORS = (window['XMLHttpRequest'] !== undefined) &&
    ((new XMLHttpRequest())['withCredentials'] !== undefined);


/**
 * @param {string=} opt_hostOrUrl Хост либо адрес.
 * @param {boolean=} opt_isSecure Флаг защищенности соединенияю.
 * @param {number=} opt_port Порт.
 * @param {boolean=} opt_needResult Флаг необходимости получения результата
 *    запроса. По-умочанию результат считается необходимым.
 * @return {!net.Request} Объект запроса.
 */
net.createRequest =
    function(opt_hostOrUrl, opt_isSecure, opt_port, opt_needResult) {
  return (new net.factory.RequestFactory(
      opt_hostOrUrl, opt_isSecure, opt_port)).createRequest(opt_needResult);
};


/**
 * @param {string=} opt_hostOrUrl Хост либо адрес.
 * @param {boolean=} opt_isSecure Флаг защищенности соединенияю.
 * @param {number=} opt_port Порт.
 * @return {WebSocket} Объект соединения, в том случае, если его можно создать.
 */
net.createSocket = function(opt_hostOrUrl, opt_isSecure, opt_port) {
  return (new net.factory.SocketFactory(
      opt_hostOrUrl, opt_isSecure, opt_port)).createSocket();
};


/**
 * @param {string=} opt_hostOrUrl Хост либо адрес.
 * @param {boolean=} opt_isSecure Флаг защищенности соединенияю.
 * @param {number=} opt_port Порт.
 * @param {string=} opt_protocol Протокол ws or http.
 * @return {string} Скомпонованная строка адреса.
 */
net.makeUrl = function(opt_hostOrUrl, opt_isSecure, opt_port, opt_protocol) {
  if (opt_hostOrUrl.indexOf('://') !== -1) {
    return opt_hostOrUrl;
  }

  var host = opt_hostOrUrl || location.hostname;
  var isSecure = opt_isSecure || location.protocol === 'https:';
  var port = (opt_port || (location.port || (isSecure ? 443 : 80))) + '';
  var protocol = opt_protocol || 'http';

  var url = protocol + (isSecure ? 's' : '') + '://' + host;

  if (port === '443' && isSecure || port === '80' && !isSecure) {
    url += '/';
  } else {
    url += ':' + port + '/';
  }

  return url;
};
