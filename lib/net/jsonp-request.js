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
 * @type {string}
 */
net.JsonpRequest.__DATA_KEY = 'lt-jsonp-data';


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
  if (!net.CAN_SAVE_COOKIE) {
    var cookies = this.__findDomainCookies(this.getUrl());
    if (cookies !== '') {
      this.setHeader('cookie', cookies);
    }
  }

  var url = this.getUrl() + path;

  url += (url.indexOf('?') === -1 ? '?' : '&') + '__fallback__&' +
      util.encodeFormData({
        '': '',
        '_m': this.getMethod(),
        '_c': this.__callbackName,
        '_t': 'jsonp',
        '_': data || undefined,
        '_rnd': Math.random().toString(36).substr(2)
      }) + net.encodeHeadersFallback(this.getHeaders());

  var self = this;

  /**
   * @param {string=} opt_data Данные реузльтата.
   * @param {number=} opt_status Статус реузльтата.
   * @param {string=} opt_cookie Статус реузльтата.
   */
  function callback(opt_data, opt_status, opt_cookie) {
    if (!net.CAN_SAVE_COOKIE && opt_cookie !== undefined) {
      var cookies = opt_cookie.split('; ');
      for (var i = 0; i < cookies.length; i += 1) {
        var cookie = cookies[i];

        if (cookie !== '') {
          var name = self.__extractCookieKey(cookie);
          var jsonpCookies =
              util.decodeJsonData(
                  util.loadFromStorage(net.JsonpRequest.__DATA_KEY));

          if (!(jsonpCookies instanceof Object)) {
            jsonpCookies = {};
          }

          jsonpCookies[name] =
              {
                'domain': self.__extractCookieDomain(cookie),
                'value': self.__extractCookieValue(cookie)
              };

          util.saveToStorage(net.JsonpRequest.__DATA_KEY,
              util.encodeJsonData(jsonpCookies), lt.sm.VISITOR_COOKIE_TIMEOUT);
        }
      }
    }
    self._handleResult(opt_status === undefined ? 404 : opt_status, opt_data);
  }

  window[this.__callbackName] = callback;

  this.__script = document.createElement('SCRIPT');
  this.__script.charset = net.CHARSET_ENCODING;
  this.__script.id = this.__id;
  this.__script.src = url;

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
 * @param {string} cookie Куки.
 * @return {string} Домен.
 */
net.JsonpRequest.prototype.__extractCookieDomain = function(cookie) {
  var token = 'domain=';
  var tokenIndex = cookie.indexOf(token);
  if (tokenIndex !== -1) {
    var semicolonIndex = cookie.indexOf(';', tokenIndex);
    if (semicolonIndex === -1) {
      return cookie.substring(tokenIndex + token.length);
    } else {
      return cookie.substring(tokenIndex + token.length, semicolonIndex);
    }
  }

  return '';
};


/**
 * @param {string} cookie Куки.
 * @return {string} Ключ.
 */
net.JsonpRequest.prototype.__extractCookieKey = function(cookie) {
  var index = cookie.indexOf('=');

  if (index !== -1) {
    return cookie.substring(0, index);
  }

  return '';
};


/**
 * @param {string} cookie Куки.
 * @return {string} Значение.
 */
net.JsonpRequest.prototype.__extractCookieValue = function(cookie) {
  var separatorIndex = cookie.indexOf('=');

  if (separatorIndex !== -1) {
    var semicolonIndex = cookie.indexOf(';');

    if (semicolonIndex !== -1) {
      return cookie.substring(separatorIndex + 1, semicolonIndex);
    } else {
      return cookie.substring(separatorIndex + 1);
    }
  }

  return '';
};


/**
 * @param {string} url Куки.
 * @return {string} Домен.
 */
net.JsonpRequest.prototype.__extractUrlDomain = function(url) {
  var token = '//';
  var tokenIndex = url.indexOf(token);
  if (tokenIndex !== -1) {
    var semicolonIndex = url.indexOf('/', tokenIndex + token.length);
    if (semicolonIndex === -1) {
      return url.substring(tokenIndex + token.length);
    } else {
      return url.substring(tokenIndex + token.length, semicolonIndex);
    }
  }

  return '';
};


/**
 * @param {string} url Куки.
 * @return {string} Куки.
 */
net.JsonpRequest.prototype.__findDomainCookies = function(url) {
  var fullDomain = this.__extractUrlDomain(url);
  var cookies = util.decodeJsonData(
      util.loadFromStorage(net.JsonpRequest.__DATA_KEY));
  var result = [];

  function checkDomain(addr, domain) {
    var fullName = addr.split(':')[0];
    return domain && fullName.slice(fullName.length - domain.length) === domain;
  }

  for (var name in cookies) {
    var cookie = cookies[name];
    if (cookie !== undefined) {
      if (checkDomain(fullDomain, cookie['domain'])) {
        result.push(name + '=' + cookie['value']);
      }
    }
  }
  return result.join('; ');
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
