


/**
 * Релизация HTTP-запроса с использованием <code>XDomainRequest</code>.
 *
 * @see net.Request
 * @constructor
 * @extends {net.Request}
 * @param {string} url Базовый адрес запроса.
 */
net.XdmRequest = function(url) {
  net.Request.call(this, url);

  /**
   * @type {XDomainRequest}
   */
  this.__request = null;
};

util.inherits(net.XdmRequest, net.Request);


/**
 * @inheritDoc
 */
net.XdmRequest.prototype._canSend = function() {
  return this.__request === null;
};


/**
 * @inheritDoc
 */
net.XdmRequest.prototype._doSend = function(data, path) {
  this.__request = this.__createRequest();

  if (this.__request !== null) {
    var method = this.getMethod();
    var self = this;

    this.__request.onload = function() {
      if (self.__request !== null) {
        self._handleResult(200, self.__request.responseText || '');
      }
    };

    this.__request.onerror = function() {
      self._handleResult(200);
    };

    var requestURL = this.getUrl() + path;
    if (method === net.RequestMethod.GET && data.length !== 0) {
      requestURL += (requestURL.indexOf('?') === -1 ? '?' : '&') + data;
    }

    this.__request.open(method, encodeURI(requestURL));

    try {
      this.__request.send(data);
    } catch (error) {
      console.error(error.message);

      this._handleResult(500);
    }
  } else {
    console.error('Unable to create instance of XDomainRequest.');

    this._handleResult(500);
  }
};


/**
 * @inheritDoc
 */
net.XdmRequest.prototype._reset = function() {
  if (this.__request !== null) {
    this.__request.onreadystatechange = util.nop;
    this.__request.abort();
    this.__request = null;
  }
};


/**
 * Создание экземпляра объекта <code>XdmRequest</code>.
 *
 * @return {XDomainRequest} Объект запроса.
 */
net.XdmRequest.prototype.__createRequest = function() {
  if (window['XDomainRequest'] !== undefined) {
    return new XDomainRequest();
  }

  return null;
};