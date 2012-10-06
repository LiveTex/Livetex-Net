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
 * HTTP-запрос на основе запроса HTML формы.
 *
 * @constructor
 * @extends {net.Request}
 * @param {string} url Адрес запроса.
 */
net.FormRequest = function(url) {
  net.Request.call(this, url);

  /**
   * @type {!Node}
   */
  this.__frame = this.__createFrame();
  this.__frame.style.display = 'none';

  /**
   * @type {Node}
   */
  this.__form = null;

  document.body.appendChild(this.__frame);
};

util.inherits(net.FormRequest, net.Request);


/**
 * Счетчик суффикса имени фрейма.
 *
 * @type {number}
 */
net.FormRequest.__lastId = 0;


/**
 * Префикс имени фрейма.
 *
 * @type {string}
 */
net.FormRequest.FRAME_PREFIX = 'fr_';


/**
 * @inheritDoc
 */
net.FormRequest.prototype._canSend = function() {
  return this.__form === null;
};


/**
 * @inheritDoc
 */
net.FormRequest.prototype.abort = function() {
  net.Request.prototype.abort.call(this);
  this.__clearRequest();
};


/**
 * @inheritDoc
 */
net.FormRequest.prototype._doSend = function(path, opt_data) {
  this.__form = document.body.appendChild(document.createElement('FORM'));
  this.__form.style.display = 'none';
  this.__form.method = this.getMethod();
  this.__form.action = this.getUrl() + path;
  this.__form.target = this.__frame.name;

  var inputs = [];
  if (opt_data instanceof Object) {
    var tokens = util.tokenizeUrlData(opt_data);
    while (tokens.length > 0) {
      inputs.push(this.__createInput(tokens.shift()));
    }
  } else if (opt_data !== undefined) {
    inputs.push(this.__createInput('_=' + opt_data));
  }

  while (inputs.length > 0) {
    this.__form.appendChild(inputs.shift());
  }

  var self = this;

  this.__frame.onreadystatechange = function() {
    if (self.__frame.readyState === 'complete' ||
        self.__frame.readyState === 'loaded') {

      self.__handleResult();
    }
  };

  this.__frame.onload = function() {
    self.__handleResult();
  };

  this.__form.submit();
};


/**
 * Обработка результата запроса.
 */
net.FormRequest.prototype.__handleResult = function() {
  this.__clearRequest();
  this.dispatch('complete', new net.RequestData(200, ''));
  this._process();
};


/**
 * Очищение запроса.
 */
net.FormRequest.prototype.__clearRequest = function() {
  this.__frame.onreadystatechange = util.nop;
  this.__frame.onload = util.nop;

  if (this.__form !== null) {
    document.body.removeChild(this.__form);

    this.__form = null;
  }
};


/**
 * Создание элемента данных формы.
 *
 * @param {string} urlToken Имя и данные разделенные знаком `=`.
 * @return {!Node} Созданный элемент формы.
 */
net.FormRequest.prototype.__createInput = function(urlToken) {
  var parsedToken = urlToken.split('=');

  var input = document.createElement('INPUT');
  input.type = 'hidden';
  input.name = parsedToken[0];
  input.value = parsedToken[1];

  return input;
};


/**
 * Создание фрейма для запроса.
 *
 * @return {!Node} Созданный фрейм.
 */
net.FormRequest.prototype.__createFrame = function() {
  var name = net.FormRequest.FRAME_PREFIX + (net.FormRequest.__lastId += 1);

  try {
    return document.createElement('<iframe name="' + name + '">');
  } catch (error) {
    var frame = document.createElement('IFRAME');
    frame.name = name;

    return frame;
  }
};
