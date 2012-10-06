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
 * Абстрактный класс HTTP запроса.
 *
 * @see net.Request#send
 * @constructor
 * @extends {events.EventDispatcher}
 * @event complete Событие получения результата запроса.
 *
 * @param {string} url Адрес к которому необходимо выполнить запрос.
 */
net.Request = function(url) {
  events.EventDispatcher.call(this);

  /**
   * @type {string}
   */
  this.__url = (url.charAt(url.length - 1) === '/') ? url : (url + '/');

  /**
   * @type {!Array.<!Array.<string>>}
   */
  this.__sendQueue = [];

  /**
   * @type {string}
   */
  this.__method = net.Request.METHOD_GET;
};

util.inherits(net.Request, events.EventDispatcher);


/**
 * Тип `GET` метода запроса.
 *
 * @type {string}
 */
net.Request.METHOD_GET = 'GET';


/**
 * Тип `POST` метода запроса.
 *
 * @type {string}
 */
net.Request.METHOD_POST = 'POST';


/**
 * Получение метода запроса.
 *
 * @return {string} Метод запроса.
 */
net.Request.prototype.getMethod = function() {
  return this.__method;
};


/**
 * Установка метода запроса.
 *
 * @param {string} method Метод запроса.
 */
net.Request.prototype.setMethod = function(method) {
  this.__method = method;
};


/**
 * Получение адреса запроса.
 *
 * @return {string} Адрес запроса.
 */
net.Request.prototype.getUrl = function() {
  return this.__url;
};


/**
 * Отсылка запроса.
 *
 * @see net.Request#getUrl
 * @param {string=} opt_path Путь при запросе к указанному выше адресу.
 * @param {(string|!Object)=} opt_data Данные запроса.
 */
net.Request.prototype.send = function(opt_path, opt_data) {
  if (opt_path === undefined) {
    arguments[0] = '';
  } else if (opt_path.charAt(0) === '/') {
    arguments[0] = opt_path.substr(1);
  }

  this.__sendQueue.push(arguments);
  this._process();
};


/**
 * Остановка выполнения запроса.
 */
net.Request.prototype.abort = function() {
  this.__sendQueue.length = 0;
};


/**
 * Обработка очереди отсылок.
 *
 * @protected
 */
net.Request.prototype._process = function() {
  if (this._canSend()) {
    while (this.__sendQueue.length > 0) {
      this._doSend.apply(this, this.__sendQueue.shift());
    }
  }
};


/**
 * Проверка возможности отправки.
 *
 * @protected
 * @return {boolean} Результат проверки.
 */
net.Request.prototype._canSend = function() {
  return false;
};


/**
 * Реализация отсылки запроса.
 *
 * @protected
 * @param {string} path  Путь при запросе к указанному выше адресу.
 * @param {(string|!Object)=} opt_data Данные запроса.
 */
net.Request.prototype._doSend = function(path, opt_data) {};
