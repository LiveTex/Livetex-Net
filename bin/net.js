var net = {};
net.factory = {};
net.CAN_USE_CORS = window["XMLHttpRequest"] !== undefined && (new XMLHttpRequest)["withCredentials"] !== undefined;
net.createRequest = function(opt_hostOrUrl, opt_isSecure, opt_port, opt_needResult) {
  return(new net.factory.RequestFactory(opt_hostOrUrl, opt_isSecure, opt_port)).createRequest(opt_needResult)
};
net.createSocket = function(opt_hostOrUrl, opt_isSecure, opt_port) {
  return(new net.factory.SocketFactory(opt_hostOrUrl, opt_isSecure, opt_port)).createSocket()
};
net.makeUrl = function(opt_hostOrUrl, opt_isSecure, opt_port, opt_protocol) {
  if(opt_hostOrUrl !== undefined) {
    if(opt_hostOrUrl.indexOf("://") !== -1) {
      return opt_hostOrUrl
    }
    if(opt_hostOrUrl.indexOf("//") === 0) {
      if(opt_protocol !== undefined) {
        return opt_protocol + ":" + opt_hostOrUrl
      }else {
        return opt_hostOrUrl
      }
    }
  }
  var host = opt_hostOrUrl || location.hostname;
  var isSecure = opt_isSecure || location.protocol === "https:";
  var port = (opt_port || location.port || (isSecure ? 443 : 80)) + "";
  var protocol = opt_protocol || "http";
  var url = protocol + (isSecure ? "s" : "") + "://" + host;
  if(port === "443" && isSecure || port === "80" && !isSecure) {
    url += "/"
  }else {
    url += ":" + port + "/"
  }
  return url
};
net.RequestMethod = {GET:"GET", POST:"POST"};
net.RequestEvent = function(target, type, responseStatus) {
  events.Event.call(this, target, type);
  this.__responseStatus = responseStatus
};
util.inherits(net.RequestEvent, events.Event);
net.RequestEvent.COMPLETE = "complete";
net.RequestEvent.prototype.getResponseStatus = function() {
  return this.__responseStatus
};
net.Request = function(url) {
  events.EventDispatcher.call(this);
  this.__url = url.charAt(url.length - 1) === "/" ? url : url + "/";
  this.__method = net.RequestMethod.GET;
  this.__sendQueue = [];
  this.__flush = util.bind(this.__flush, this)
};
util.inherits(net.Request, events.EventDispatcher);
net.Request.prototype.getUrl = function() {
  return this.__url
};
net.Request.prototype.setMethod = function(method) {
  this.__method = method
};
net.Request.prototype.getMethod = function() {
  return this.__method
};
net.Request.prototype.send = function(data, opt_path) {
  if(opt_path === undefined) {
    arguments[1] = ""
  }else {
    if(opt_path.charAt(0) === "/") {
      arguments[1] = opt_path.substr(1)
    }
  }
  this.__sendQueue.push(arguments);
  util.async(this.__flush)
};
net.Request.prototype.cancel = function() {
  this.__sendQueue.length = 0
};
net.Request.prototype.abort = function() {
  if(!this._canSend()) {
    this._handleResult(0)
  }
};
net.Request.prototype._canSend = function() {
  return false
};
net.Request.prototype._doSend = function(data, path) {
};
net.Request.prototype._handleResult = function(status, opt_data) {
  this._reset();
  util.async(this.__flush);
  this.dispatch(new net.RequestEvent(this, net.RequestEvent.COMPLETE, status), opt_data)
};
net.Request.prototype._reset = function() {
};
net.Request.prototype.__flush = function() {
  while(this._canSend() && this.__sendQueue.length > 0) {
    this._doSend.apply(this, this.__sendQueue.shift())
  }
};
net.XhrRequest = function(url) {
  net.Request.call(this, url);
  this.__request = null
};
util.inherits(net.XhrRequest, net.Request);
net.XhrRequest.prototype._canSend = function() {
  return this.__request === null
};
net.XhrRequest.prototype._doSend = function(data, path) {
  this.__request = this.__createRequest();
  if(this.__request !== null) {
    var method = this.getMethod();
    var self = this;
    this.__request.onreadystatechange = function() {
      if(self.__request !== null && self.__request.readyState === 4) {
        var data = self.__request.responseText || "";
        var status = self.__request.status || 500;
        if(status === 1223) {
          status = 204
        }
        self._handleResult(status, data)
      }
    };
    var requestURL = this.getUrl() + path;
    if(method === net.RequestMethod.GET && data.length !== 0) {
      requestURL += (requestURL.indexOf("?") === -1 ? "?" : "&") + data
    }
    this.__request.open(method, encodeURI(requestURL), true);
    var sendData = null;
    if(method !== net.RequestMethod.GET) {
      this.__request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      sendData = data
    }else {
      this.__request.setRequestHeader("Content-Type", "text/plain")
    }
    try {
      this.__request.send(sendData)
    }catch(error) {
      console.error(error.message);
      this._handleResult(500)
    }
  }else {
    console.error("Unable to create instance of XMLHttpRequest.");
    this._handleResult(500)
  }
};
net.XhrRequest.prototype._reset = function() {
  if(this.__request !== null) {
    this.__request.onreadystatechange = util.nop;
    this.__request.abort();
    this.__request = null
  }
};
net.XhrRequest.prototype.__createRequest = function() {
  if(window["XMLHttpRequest"] !== undefined) {
    return new XMLHttpRequest
  }
  if(window["ActiveXObject"] !== undefined) {
    return new ActiveXObject("Microsoft.XMLHTTP")
  }
  return null
};
net.JsonpRequest = function(url) {
  net.Request.call(this, url);
  this.__id = "jspr_" + net.JsonpRequest.__lastId++;
  this.__script = null;
  this.__timeout = -1
};
util.inherits(net.JsonpRequest, net.Request);
net.JsonpRequest.__lastId = 0;
net.JsonpRequest.ERROR_TIMEOUT = 3E4;
net.JsonpRequest.CALLBACK_TABLE = "__jsonp";
net.JsonpRequest.prototype._canSend = function() {
  return this.__script === null
};
net.JsonpRequest.prototype._doSend = function(data, path) {
  var requestURL = this.getUrl() + path;
  if(requestURL.indexOf("?") === -1) {
    requestURL += "?"
  }
  requestURL += util.encodeFormData({"__m":this.getMethod(), "__c":net.JsonpRequest.CALLBACK_TABLE + '["' + this.__id + '"]', "__p":data || undefined}) + "&jsonp";
  var self = this;
  function callback(opt_status, opt_data) {
    self._handleResult(opt_status === undefined ? 404 : 0, opt_data)
  }
  if(window[net.JsonpRequest.CALLBACK_TABLE] === undefined) {
    window[net.JsonpRequest.CALLBACK_TABLE] = {}
  }
  window[net.JsonpRequest.CALLBACK_TABLE][this.__id] = callback;
  this.__script = document.createElement("SCRIPT");
  this.__script.id = this.__id;
  this.__script.src = requestURL;
  this.__script.onreadystatechange = function() {
    if(self.__script.readyState === "complete" || self.__script.readyState === "loaded") {
      callback()
    }
  };
  this.__script.onload = function() {
    callback()
  };
  this.__timeout = setTimeout(callback, net.JsonpRequest.ERROR_TIMEOUT);
  document.body.appendChild(this.__script)
};
net.JsonpRequest.prototype._reset = function() {
  if(this.__timeout !== -1) {
    clearTimeout(this.__timeout)
  }
  if(this.__script !== null) {
    this.__script.onreadystatechange = util.nop;
    this.__script.onload = util.nop;
    document.body.removeChild(this.__script);
    delete window[net.JsonpRequest.CALLBACK_TABLE][this.__script.id];
    this.__script = null
  }
};
net.FormRequest = function(url) {
  net.Request.call(this, url);
  this.__frame = this.__createFrame();
  this.__frame.style.display = "none";
  this.__form = null;
  document.body.appendChild(this.__frame)
};
util.inherits(net.FormRequest, net.Request);
net.FormRequest.__lastId = 0;
net.FormRequest.FRAME_PREFIX = "fr_";
net.FormRequest.prototype._canSend = function() {
  return this.__form === null
};
net.FormRequest.prototype._doSend = function(path, opt_data) {
  this.__form = document.body.appendChild(document.createElement("FORM"));
  this.__form.style.display = "none";
  this.__form.method = this.getMethod();
  this.__form.action = this.getUrl() + path;
  this.__form.target = this.__frame.name;
  if(opt_data !== undefined) {
    this.__form.appendChild(this.__createInput("_=" + opt_data))
  }
  var self = this;
  this.__frame.onreadystatechange = function() {
    if(self.__frame.readyState === "complete" || self.__frame.readyState === "loaded") {
      self._handleResult(200)
    }
  };
  this.__frame.onload = function() {
    self._handleResult(200)
  };
  this.__form.submit()
};
net.FormRequest.prototype._reset = function() {
  this.__frame.onreadystatechange = util.nop;
  this.__frame.onload = util.nop;
  if(this.__form !== null) {
    document.body.removeChild(this.__form);
    this.__form = null
  }
};
net.FormRequest.prototype.__createInput = function(urlToken) {
  var parsedToken = urlToken.split("=");
  var input = document.createElement("INPUT");
  input.type = "hidden";
  input.name = parsedToken[0];
  input.value = parsedToken[1];
  return input
};
net.FormRequest.prototype.__createFrame = function() {
  var name = net.FormRequest.FRAME_PREFIX + (net.FormRequest.__lastId += 1);
  try {
    return document.createElement('<iframe name="' + name + '">')
  }catch(error) {
    var frame = document.createElement("IFRAME");
    frame.name = name;
    return frame
  }
};
net.factory.IRequestFactory = function() {
};
net.factory.IRequestFactory.prototype.createRequest = function(opt_needResult) {
};
net.factory.ISocketFactory = function() {
};
net.factory.ISocketFactory.prototype.createSocket = function() {
};
net.factory.RequestFactory = function(opt_hostOrUrl, opt_isSecure, opt_port) {
  this.__url = net.makeUrl(opt_hostOrUrl, opt_isSecure, opt_port);
  this.__sameDomain = this.__url.indexOf(location.protocol + "//" + location.host + "/") === 0
};
net.factory.RequestFactory.prototype.createRequest = function(opt_needResult) {
  if(this.__sameDomain || net.CAN_USE_CORS) {
    return new net.XhrRequest(this.__url)
  }
  if(opt_needResult === undefined || opt_needResult) {
    return new net.JsonpRequest(this.__url)
  }
  return new net.FormRequest(this.__url)
};
net.factory.SocketFactory = function(opt_hostOrUrl, opt_isSecure, opt_port) {
  this.__url = net.makeUrl(opt_hostOrUrl, opt_isSecure, opt_port, "ws")
};
net.factory.SocketFactory.prototype.createSocket = function() {
  try {
    if(window["WebSocket"] !== undefined) {
      return new WebSocket(this.__url)
    }else {
      if(window["MozWebSocket"] !== undefined) {
        return new window["MozWebSocket"](this.__url)
      }
    }
  }catch(error) {
  }
  return null
};

