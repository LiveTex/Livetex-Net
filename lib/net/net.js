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
 * Версия библиотеки.
 *
 * @type {string}
 */
net.VERSION = '0.0.1';


/**
 * Есть ли возможность использовать кросдоменны запрос.
 *
 * @type {boolean}
 */
net.CAN_USE_CORS = (window['XMLHttpRequest'] !== undefined) &&
    ((new window['XMLHttpRequest']())['withCredentials'] !== undefined);


/**
 * @type {string}
 */
net.__CURRENT_URL = location.protocol + '//' + location.host + '/';


/**
 * Создание объекта найболее подходящего запроса.
 *
 * @see net.Request
 * @param {string=} opt_hostOrUrl Хост либо полный адрес.
 * @param {boolean=} opt_isSecure Флаг использования защищенного соединения.
 * @param {number=} opt_port Порт.
 * @param {boolean=} opt_needResult Флаг необходимости обработки результата,
 *    `true` по-умолчанию.
 * @return {!net.Request} Созданный объект запроса.
 */
net.createRequest =
    function(opt_hostOrUrl, opt_isSecure, opt_port, opt_needResult) {

  var url = net.makeUrl(opt_hostOrUrl, opt_isSecure, opt_port);


  if (net.CAN_USE_CORS || url.indexOf(net.__CURRENT_URL) === 0) {
    return new net.XhrRequest(url);
  }

  if (opt_needResult === undefined ? true : opt_needResult) {
    return new net.JsonpRequest(url);
  }

  return new net.FormRequest(url);
};


/**
 * Создание объекта web-сокет соединения.
 *
 * @param {string=} opt_hostOrUrl Хост либо полный адрес.
 * @param {boolean=} opt_isSecure Флаг использования защищенного соединения.
 * @param {number=} opt_port Порт.
 * @return {WebSocket} Созданный объект web-сокетного соединения.
 */
net.createSocket = function(opt_hostOrUrl, opt_isSecure, opt_port) {
  var url = net.makeUrl(opt_hostOrUrl, opt_isSecure, opt_port, 'ws');

  if (window['WebSocket'] !== undefined) {
    return new WebSocket(url);
  } else if (window['MozWebSocket'] !== undefined) {
    return new window['MozWebSocket'](url);
  }

  return null;
};


/**
 * Создание строки URL-адреса с заданными параметрами.
 *
 * @param {string=} opt_hostOrUrl Хост либо полный адрес.
 * @param {boolean=} opt_isSecure Флаг использования защищенного соединения.
 * @param {number=} opt_port Порт.
 * @param {string=} opt_protocol Протокол.
 * @return {string} Строка URL-адреса.
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
