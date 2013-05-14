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
net.FormRequest = function(url) {
  net.Request.call(this, url);

  /**
   * @type {string}
   */
  this.__id = 'nfr_' + (net.FormRequest.__lastId += 1);

  /**
   * @type {string}
   */
  this.__frameName = this.__id + '_frame';

  /**
   * @type {Node}
   */
  this.__frame = null;

  /**
   * @type {Node}
   */
  this.__form = null;
};

util.inherits(net.FormRequest, net.Request);


/**
 * @type {number}
 */
net.FormRequest.__lastId = 0;


/**
 * @inheritDoc
 */
net.FormRequest.prototype._canSend = function() {
  return this.__form === null;
};


/**
 * @inheritDoc
 */
net.FormRequest.prototype._doSend = function(data, path) {
  this.__frame = document.body.appendChild(this.__createFrame());
  this.__frame.style.display = 'none';

  this.__form = document.body.appendChild(document.createElement('FORM'));
  this.__form.style.display = 'none';
  this.__form.method = this.getMethod();
  this.__form.action = this.getUrl() + path;
  this.__form.target = this.__frameName;

  if (data !== '') {
    this.__form.appendChild(this.__createInput('_', data));
  }

  var self = this;

  /**
   * @param {number=} opt_status Статус реузльтата.
   * @param {string=} opt_data Данные реузльтата.
   */
  function callback(opt_status, opt_data) {
    util.async(function() {
      self._handleResult(opt_status === undefined ? 404 : 0, opt_data);
    });
  }

  this.__frame.onreadystatechange = function() {
    if (self.__frame !== null &&
        self.__frame.readyState === 'complete' ||
        self.__frame.readyState === 'loaded') {

      callback(200);
    }
  };

  this.__frame.onload = function() {
    callback(200);
  };

  this.__form.submit();
};


/**
 * @inheritDoc
 */
net.FormRequest.prototype._reset = function() {
  if (this.__frame !== null) {
    document.body.removeChild(this.__frame);

    this.__frame.onreadystatechange = util.nop;
    this.__frame.onload = util.nop;
    this.__frame = null;
  }

  if (this.__form !== null) {
    document.body.removeChild(this.__form);

    this.__form = null;
  }
};


/**
 * Создание элемента данных формы.
 *
 * @param {string} name Имя.
 * @param {string} value Данные.
 * @return {!Node} Созданный элемент формы.
 */
net.FormRequest.prototype.__createInput = function(name, value) {
  var input = document.createElement('INPUT');
  input.type = 'hidden';
  input.name = name;
  input.value = value;

  return input;
};


/**
 * Создание фрейма для запроса.
 *
 * @return {!Node} Созданный фрейм.
 */
net.FormRequest.prototype.__createFrame = function() {
  try {
    return document.createElement('<iframe name="' + this.__frameName + '">');
  } catch (error) {
    var frame = document.createElement('IFRAME');
    frame.name = this.__frameName;

    return frame;
  }
};
