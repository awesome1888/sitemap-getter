'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require('stream');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stream = function (_Duplex) {
    _inherits(Stream, _Duplex);

    function Stream(options) {
        _classCallCheck(this, Stream);

        options = options || {};
        options.objectMode = true;

        var _this = _possibleConstructorReturn(this, (Stream.__proto__ || Object.getPrototypeOf(Stream)).call(this, options));

        _this._buffer = [];
        return _this;
    }

    _createClass(Stream, [{
        key: '_write',
        value: function _write(chunk, encoding, callback) {
            this._buffer.push(chunk);
            callback();
        }
    }, {
        key: '_read',
        value: function _read(size) {
            var item = this._buffer.shift();
            if (item) {
                this.push(item);
            }
        }
    }]);

    return Stream;
}(_stream.Duplex);

exports.default = Stream;