'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sax = require('sax');

var _sax2 = _interopRequireDefault(_sax);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _stream = require('./lib/stream.js');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SitemapParser = function () {
    function SitemapParser() {
        _classCallCheck(this, SitemapParser);
    }

    _createClass(SitemapParser, null, [{
        key: 'createStream',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
                var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, result, saxStream;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                parameters = _lodash2.default.isObject(parameters) ? parameters : {};

                                _context.next = 3;
                                return this.getResponseStream(url, parameters);

                            case 3:
                                response = _context.sent;
                                result = this.getResultStream();
                                saxStream = this.getSaxStream(function (entry) {
                                    result.write(entry);
                                }, parameters);


                                response.pipe(saxStream);
                                response.on('end', function () {
                                    response.unpipe();
                                    response.destroy();
                                });

                                return _context.abrupt('return', result);

                            case 9:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function createStream(_x2) {
                return _ref.apply(this, arguments);
            }

            return createStream;
        }()
    }, {
        key: 'get',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
                var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, result, saxStream;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                parameters = _lodash2.default.isObject(parameters) ? parameters : {};

                                _context2.next = 3;
                                return this.getResponseStream(url, parameters);

                            case 3:
                                response = _context2.sent;
                                result = [];
                                saxStream = this.getSaxStream(function (entry) {
                                    result.push(entry);
                                }, parameters);


                                response.pipe(saxStream);
                                response.on('end', function () {
                                    response.unpipe();
                                    response.destroy();
                                });

                                return _context2.abrupt('return', new Promise(function (resolve) {
                                    saxStream.on('end', function () {
                                        resolve(result);
                                    });
                                    saxStream.on('data', function () {}); // full steam ahead! get all of them!
                                }));

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function get(_x4) {
                return _ref2.apply(this, arguments);
            }

            return get;
        }()
    }, {
        key: 'getSaxStream',
        value: function getSaxStream(onEntry) {
            var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var saxStream = _sax2.default.createStream(true, {
                normalize: true
            });

            if (parameters.skipParseErrors) {
                saxStream.on("error", function (e) {
                    this._parser.error = null;
                    this._parser.resume();
                });
            }

            var entry = null;
            var tag = null;

            saxStream.on('opentag', function (node) {
                if (node.name === 'url') {
                    entry = {};
                } else {
                    if (entry) {
                        tag = node.name;
                    }
                }
            });
            saxStream.on('text', function (text) {
                text = text.trim();
                if (!text.length) {
                    // whitespace or line feed, skipping
                    return;
                }

                if (tag === 'loc' || tag === 'changefreq' || tag === 'priority') {
                    entry[tag] = text;
                } else if (tag === 'lastmod') {
                    entry.lastmod = new Date(text);
                }
            });
            saxStream.on('closetag', function (nodeName) {
                if (nodeName === 'url') {
                    if (entry !== null) {
                        // send to the output stream...
                        onEntry(entry);
                    }

                    entry = null;
                    tag = null;
                }
            });

            return saxStream;
        }
    }, {
        key: 'getResultStream',
        value: function getResultStream() {
            return new _stream2.default();
        }
    }, {
        key: 'getResponseStream',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(url) {
                var _this = this;

                var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                return _context3.abrupt('return', new Promise(function (resolve, reject) {
                                    var request = _this.getAPIByUrl(url).get(url, function (response) {
                                        // todo: support 301 and 302 redirects here
                                        if (response.statusCode.toString() !== '200') {
                                            reject(new Error(`HTTP: ${response.statusCode}`));
                                            return;
                                        }

                                        resolve(response);
                                    });

                                    if (!isNaN(parameters.timeout)) {
                                        request.setTimeout(parameters.timeout, function () {
                                            reject(new Error('Timeout'));
                                        });
                                    }

                                    request.on('error', function (error) {
                                        reject(error);
                                    });
                                }));

                            case 1:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getResponseStream(_x7) {
                return _ref3.apply(this, arguments);
            }

            return getResponseStream;
        }()
    }, {
        key: 'getAPIByUrl',
        value: function getAPIByUrl(url) {
            url = this.normalizeUrl(url);
            if (!url.length) {
                throw new RangeError('Bad url');
            }

            return url.startsWith('https:') ? _https2.default : _http2.default;
        }
    }, {
        key: 'normalizeUrl',
        value: function normalizeUrl(url) {
            if (!_lodash2.default.isString(url)) {
                return '';
            }

            return url.trim();
        }
    }]);

    return SitemapParser;
}();

exports.default = SitemapParser;