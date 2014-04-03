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
 * @type {boolean}
 */
net.CAN_SAVE_COOKIE = !navigator.userAgent.match(
    /Mozilla\/5.0.+AppleWebKit\/.+Version\/.+Safari\/|Trident|Presto/i);

/**
 * @type {string}
 */
net.CHARSET_ENCODING = 'UTF-8';

/**
 * @param {string=} opt_hostOrUrl Хост либо адрес.
 * @param {boolean=} opt_isSecure Флаг защищенности соединенияю.
 * @param {number=} opt_port Порт.
 * @param {boolean=} opt_needResult Флаг необходимости получения результата
 *    запроса. По-умочанию результат считается необходимым.
 * @return {!net.Request} Объект запроса.
 */
net.createRequest =
    function(opt_hostOrUrl, opt_isSecure, opt_port, opt_needResult) {};

/**
 * @param {string=} opt_hostOrUrl Хост либо адрес.
 * @param {boolean=} opt_isSecure Флаг защищенности соединенияю.
 * @param {number=} opt_port Порт.
 * @return {WebSocket} Объект соединения, в том случае, если его можно создать.
 */
net.createSocket = function(opt_hostOrUrl, opt_isSecure, opt_port) {};

/**
 * @param {string=} opt_hostOrUrl Хост либо адрес.
 * @param {boolean=} opt_isSecure Флаг защищенности соединенияю.
 * @param {number=} opt_port Порт.
 * @param {string=} opt_protocol Протокол ws or http.
 * @return {string} Скомпонованная строка адреса.
 */
net.makeUrl = function(opt_hostOrUrl, opt_isSecure, opt_port, opt_protocol) {};

/**
 * @param {!Object.<string, string>=} headers Заголовки запроса.
 * @return {string} Закодированные заголовки для GET строки.
 */
net.encodeHeadersFallback = function(headers) {};

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
 * Метод HTTP-запроса.
 *
 * @enum {string}
 */
net.RequestMethod = {
  GET: 'GET',
  POST: 'POST'
};

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
 * События завершения HTTP-запроса к серверу.
 *
 * @constructor
 * @extends {events.Event}
 * @param {!events.IEventDispatcher} target Объект, событие которого
 *        произошло.
 * @param {string} type Тип события.
 * @param {number} responseStatus HTTP-статус ответа.
 * @param {string=} opt_data Данные ответа.
 */
net.RequestEvent = function(target, type, responseStatus, opt_data) {};

/**
 * @type {string}
 */
net.RequestEvent.COMPLETE = 'complete';

/**
 * @return {string} Данные ответа.
 */
net.RequestEvent.prototype.getResponseData = function() {};

/**
 * @return {number} HTTP-статус ответа.
 */
net.RequestEvent.prototype.getResponseStatus = function() {};

/**
 * @return {boolean} Была ли ошибка запроса.
 */
net.RequestEvent.prototype.isRequestFailed = function() {};

/**
 * @return {boolean} Была ли ошибка запроса.
 */
net.RequestEvent.prototype.isRequestFailLocal = function() {};

/**
 * @return {boolean} Была ли ошибка запроса.
 */
net.RequestEvent.prototype.isRequestTimeout = function() {};

/**
 * @return {boolean} Была ли ошибка запроса.
 */
net.RequestEvent.prototype.isRequestForbidden = function() {};

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
net.Request = function(url) {};

/**
 * @param {number} timeout Максимальное время запроса.
 */
net.Request.prototype.setTimeoutTime = function(timeout) {};

/**
 * @return {string} Базовый адрес запроса.
 */
net.Request.prototype.getUrl = function() {};

/**
 * @param {!net.RequestMethod} method Тип метода запроса.
 */
net.Request.prototype.setMethod = function(method) {};

/**
 * @return {!net.RequestMethod} Тип метода запроса.
 */
net.Request.prototype.getMethod = function() {};

/**
 * @param {!Object.<string, string>} headers Значение.
 */
net.Request.prototype.setHeaders = function(headers) {};

/**
 * @return {!Object.<string, string>} Заголовки.
 */
net.Request.prototype.getHeaders = function() {};

/**
 * @param {string} key Ключ.
 * @param {string} value Значение.
 */
net.Request.prototype.setHeader = function(key, value) {};

/**
 * @param {string} key Ключ.
 * @return {string} Значение.
 */
net.Request.prototype.getHeader = function(key) {};

/**
 * @param {string} key Ключ.
 */
net.Request.prototype.removeHeader = function(key) {};

/**
 * Отсылка запроса.
 *
 * При отсылке, данные помещаются в очередь для отправки.
 *
 * @param {string} data Данные запроса.
 * @param {string=} opt_path Добавочный адрес для отсылки данных. По-умолчанию
 *    пустая строка.
 */
net.Request.prototype.send = function(data, opt_path) {};

/**
 * Очищение очереди отправки.
 */
net.Request.prototype.cancel = function() {};

/**
 * Вынужденное завершение обработки запроса.
 *
 * Статус ответа оборванного запроса будет равен <code>0</code>.
 */
net.Request.prototype.abort = function() {};

/**
 * Проверка возможности отсылки запроса.
 *
 * @return {boolean} Результат проверки.
 */
net.Request.prototype._isRunning = function() {};

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
net.Request.prototype._handleResult = function(status, opt_data) {};

/**
 * Очищение результатов запроса.
 */
net.Request.prototype._reset = function() {};

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
 * Релизация HTTP-запроса с использованием <code>XMLHttpRequest</code>.
 *
 * @see net.Request
 * @constructor
 * @extends {net.Request}
 * @param {string} url Базовый адрес запроса.
 * @param {boolean=} opt_useCors Использовать ли кроссдоменные куки.
 */
net.XhrRequest = function(url, opt_useCors) {};

/**
 * @inheritDoc
 */
net.XhrRequest.prototype._isRunning = function() {};

/**
 * @inheritDoc
 */
net.XhrRequest.prototype._doSend = function(data, path) {};

/**
 * Уничтожение текущего объекта запроса.
 */
net.XhrRequest.prototype._reset = function() {};

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
net.JsonpRequest = function(url) {};

/**
 * @type {number}
 */
net.JsonpRequest.ERROR_TIMEOUT = 30000;

/**
 * @type {string}
 */
net.JsonpRequest.CALLBACK_TABLE = '__jsonp';

/**
 * @inheritDoc
 */
net.JsonpRequest.prototype._isRunning = function() {};

/**
 * @inheritDoc
 */
net.JsonpRequest.prototype._doSend = function(data, path) {};

/**
 * @inheritDoc
 */
net.JsonpRequest.prototype._reset = function() {};

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
net.FormRequest = function(url) {};

/**
 * @inheritDoc
 */
net.FormRequest.prototype._isRunning = function() {};

/**
 * @inheritDoc
 */
net.FormRequest.prototype._doSend = function(data, path) {};

/**
 * @inheritDoc
 */
net.FormRequest.prototype._reset = function() {};

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
 * Интерфейс фабрики HTTP-запросов.
 *
 * @interface
 */
net.factory.IRequestFactory = function() {};

/**
 * @param {!net.RequestMethod} method Тип метода запроса.
 */
net.factory.IRequestFactory.prototype.setMethod = function(method) {};

/**
 * @param {!Object.<string, string>} headers Заголовки запроса.
 */
net.factory.IRequestFactory.prototype.setHeaders = function(headers) {};

/**
 * @param {string} key Ключ.
 * @param {string} value Значение.
 */
net.factory.IRequestFactory.prototype.setHeader = function(key, value) {};

/**
 * Создание HTTP-запроса.
 *
 * @param {boolean=} opt_needResult Флаг необходимости получения результата
 *    запроса. По-умочанию результат считается необходимым.
 * @return {!net.Request} Объект запроса.
 */
net.factory.IRequestFactory.prototype.createRequest =
    function(opt_needResult) {};

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
 * Интерфейс фабрики постоянных соединенйи с сервером.
 *
 * @interface
 */
net.factory.ISocketFactory = function() {};

/**
 * @param {string} key Ключ.
 * @param {string} value Значение.
 */
net.factory.ISocketFactory.prototype.setHeader = function(key, value) {};

/**
 * @param {!Object.<string, string>} headers Заголовки запроса.
 */
net.factory.ISocketFactory.prototype.setHeaders = function(headers) {};

/**
 * Создание постоянного соединения.
 *
 * @return {WebSocket} Объект соединения.
 */
net.factory.ISocketFactory.prototype.createSocket = function() {};

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
 * Стандартная фабрика HTTP-запросов.
 *
 * @constructor
 * @implements {net.factory.IRequestFactory}
 * @param {string=} opt_hostOrUrl Хост либо адрес.
 * @param {boolean=} opt_isSecure Флаг защищенности соединенияю.
 * @param {number=} opt_port Порт.
 */
net.factory.RequestFactory = function(opt_hostOrUrl, opt_isSecure, opt_port) {};

/**
 * @inheritDoc
 */
net.factory.RequestFactory.prototype.createRequest = function(opt_needResult) {};

/**
 * @inheritDoc
 */
net.factory.RequestFactory.prototype.setMethod = function(method) {};

/**
 * @inheritDoc
 */
net.factory.RequestFactory.prototype.setHeaders = function(headers) {};

/**
 * @inheritDoc
 */
net.factory.RequestFactory.prototype.setHeader = function(key, value) {};

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
net.factory.SocketFactory = function(opt_hostOrUrl, opt_isSecure, opt_port) {};

/**
 * @inheritDoc
 */
net.factory.SocketFactory.prototype.setHeaders = function(headers) {};

/**
 * @inheritDoc
 */
net.factory.SocketFactory.prototype.setHeader = function(key, value) {};

/**
 * @inheritDoc
 */
net.factory.SocketFactory.prototype.createSocket = function() {};


