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
 * Абстрактный класс HTTP-запроса.
 *
 * @constructor
 * @extends {events.EventDispatcher}
 *
 * @event {net.RequestEvent} complete Событие завершения обработки запроса.
 *    Сопутствующими данными события может являтся строка ответа, в том случае
 *    если  запрос может ее обработать.
 *
 * @param {string} url Базовый адрес запроса.
 */
net.Request = function(url) {
  events.EventDispatcher.call(this);

  /**
   * @type {string}
   */
  this.__url = (url.charAt(url.length - 1) === '/') ? url : (url + '/');

  /**
   * @type {!net.RequestMethod}
   */
  this.__method = net.RequestMethod.GET;

  /**
   * @type {!Array.<!Arguments>}
   */
  this.__sendQueue = [];

  /**
   * @type {!Function}
   */
  this.__flush = util.bind(this.__flush, this);
};

util.inherits(net.Request, events.EventDispatcher);


/**
 * @return {string} Базовый адрес запроса.
 */
net.Request.prototype.getUrl = function() {
  return this.__url;
};


/**
 * @param {!net.RequestMethod} method Тип метода запроса.
 */
net.Request.prototype.setMethod = function(method) {
  this.__method = method;
};


/**
 * @return {!net.RequestMethod} Тип метода запроса.
 */
net.Request.prototype.getMethod = function() {
  return this.__method;
};


/**
 * Отсылка запроса.
 *
 * При отсылке, данные помещаются в очередь для отправки.
 *
 * @param {string} data Данные запроса.
 * @param {string=} opt_path Добавочный адрес для отсылки данных. По-умолчанию
 *    пустая строка.
 */
net.Request.prototype.send = function(data, opt_path) {
  if (opt_path === undefined) {
    arguments[1] = '';
  } else if (opt_path.charAt(0) === '/') {
    arguments[1] = opt_path.substr(1);
  }

  this.__sendQueue.push(arguments);
  util.async(this.__flush);
};


/**
 * Очищение очереди отправки.
 */
net.Request.prototype.cancel = function() {
  this.__sendQueue.length = 0;
};


/**
 * Вынужденное завершение обработки запроса.
 *
 * Статус ответа оборванного запроса будет равен <code>0</code>.
 */
net.Request.prototype.abort = function() {
  if (!this._canSend()) {
    this._handleResult(0);
  }
};


/**
 * Проверка возможности отсылки запроса.
 *
 * @return {boolean} Результат проверки.
 */
net.Request.prototype._canSend = function() {
  return false;
};


/**
 * Конкретная реализация отправки запроса.
 *
 * @param {string} data Данные запроса.
 * @param {string} path Добавочный адрес для отсылки данных.
 */
net.Request.prototype._doSend = function(data, path) {};


/**
 * Обработчка результата.
 *
 * @param {number} status Статус реузльтата.
 * @param {string=} opt_data Данные результата.
 */
net.Request.prototype._handleResult = function(status, opt_data) {
  this._reset();
  util.async(this.__flush);
  this.dispatch(new net.RequestEvent(
      this, net.RequestEvent.COMPLETE, status), opt_data);
};


/**
 * Очищение результатов запроса.
 */
net.Request.prototype._reset = function() {};


/**
 * Отправка следующего запроса.
 */
net.Request.prototype.__flush = function() {
  while (this._canSend() && this.__sendQueue.length > 0) {
    this._doSend.apply(this, this.__sendQueue.shift());
  }
};
