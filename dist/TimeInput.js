'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _Divider = require('./Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Hour12Input = require('./TimeInput/Hour12Input');

var _Hour12Input2 = _interopRequireDefault(_Hour12Input);

var _Hour24Input = require('./TimeInput/Hour24Input');

var _Hour24Input2 = _interopRequireDefault(_Hour24Input);

var _MinuteInput = require('./TimeInput/MinuteInput');

var _MinuteInput2 = _interopRequireDefault(_MinuteInput);

var _SecondInput = require('./TimeInput/SecondInput');

var _SecondInput2 = _interopRequireDefault(_SecondInput);

var _NativeInput = require('./TimeInput/NativeInput');

var _NativeInput2 = _interopRequireDefault(_NativeInput);

var _AmPm = require('./TimeInput/AmPm');

var _AmPm2 = _interopRequireDefault(_AmPm);

var _dateFormatter = require('./shared/dateFormatter');

var _dates = require('./shared/dates');

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var allViews = ['hour', 'minute', 'second'];

var hoursAreDifferent = function hoursAreDifferent(date1, date2) {
  return date1 && !date2 || !date1 && date2 || date1 && date2 && date1 !== date2 // TODO: Compare 11:22:00 and 11:22 properly
  ;
};

var findPreviousInput = function findPreviousInput(element) {
  var previousElement = element.previousElementSibling; // Divider between inputs
  if (!previousElement) {
    return null;
  }
  return previousElement.previousElementSibling; // Actual input
};

var findNextInput = function findNextInput(element) {
  var nextElement = element.nextElementSibling; // Divider between inputs
  if (!nextElement) {
    return null;
  }
  return nextElement.nextElementSibling; // Actual input
};

var focus = function focus(element) {
  return element && element.focus();
};

var removeUnwantedCharacters = function removeUnwantedCharacters(str) {
  return str.split('').filter(function (a) {
    return (
      // We don't want spaces in dates
      a.charCodeAt(0) !== 32
      // Internet Explorer specific
      && a.charCodeAt(0) !== 8206
      // Remove non-ASCII characters
      && /^[\x20-\x7F]*$/.test(a)
    );
  }).join('');
};

var TimeInput = function (_PureComponent) {
  _inherits(TimeInput, _PureComponent);

  function TimeInput() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TimeInput);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TimeInput.__proto__ || Object.getPrototypeOf(TimeInput)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      amPm: null,
      hour: null,
      minute: null,
      second: null
    }, _this.isValidTime = function (timeString) {
      var _this$state = _this.state,
          minTimeString = _this$state.minTimeString,
          maxTimeString = _this$state.maxTimeString;

      return Date.parse('1990-01-01T' + timeString) && timeString >= minTimeString && timeString <= maxTimeString;
    }, _this.onKeyDown = function (event) {
      var offset = null;
      switch (event.key) {
        case 'ArrowUp':
          {
            offset = 1;
          }
        case 'ArrowDown':
          {
            event.preventDefault();
            if (!offset) offset = -1;
            var key = event.target.name;
            var _this$state2 = _this.state,
                hour = _this$state2.hour,
                minute = _this$state2.minute,
                second = _this$state2.second;

            var hourString = ('0' + hour).slice(-2);
            var minuteString = ('0' + minute).slice(-2);
            var secondString = ('0' + second).slice(-2);
            var nextValue = new Date('1900-01-01T' + hourString + ':' + minuteString + ':' + secondString);
            if (key === 'second') {
              nextValue.setSeconds(nextValue.getSeconds() + offset);
            } else if (key === 'minute') {
              nextValue.setMinutes(nextValue.getMinutes() + offset);
            } else if (key === 'hour12' || key === 'hour24') {
              nextValue.setHours(nextValue.getHours() + offset);
            }
            hourString = ('0' + nextValue.getHours()).slice(-2);
            minuteString = ('0' + nextValue.getMinutes()).slice(-2);
            secondString = ('0' + nextValue.getSeconds()).slice(-2);
            var timeString = hourString + ':' + minuteString + ':' + secondString;
            _this.onChangeKeyEvent(timeString);
            break;
          }
        case 'ArrowLeft':
          {
            event.preventDefault();

            var input = event.target;
            var previousInput = findPreviousInput(input);
            focus(previousInput);
            break;
          }
        case 'ArrowRight':
        case _this.divider:
          {
            event.preventDefault();

            var _input = event.target;
            var nextInput = findNextInput(_input);
            focus(nextInput);
            break;
          }
        default:
      }
    }, _this.onChange = function (event) {
      var _event$target = event.target,
          name = _event$target.name,
          value = _event$target.value;


      switch (name) {
        case 'hour12':
          {
            _this.setState(function (prevState) {
              return {
                hour: value ? (0, _dates.convert12to24)(parseInt(value, 10), prevState.amPm) : null
              };
            }, _this.onChangeExternal);
            break;
          }
        case 'hour24':
          {
            _this.setState({ hour: value ? parseInt(value, 10) : null }, _this.onChangeExternal);
            break;
          }
        default:
          {
            _this.setState(_defineProperty({}, name, value ? parseInt(value, 10) : null), _this.onChangeExternal);
          }
      }
    }, _this.onChangeNative = function (event) {
      var onChange = _this.props.onChange;
      var value = event.target.value;


      if (!onChange) {
        return;
      }

      var processedValue = function () {
        if (!value) {
          return null;
        }

        return value;
      }();

      onChange(processedValue, false);
    }, _this.onChangeAmPm = function (event) {
      var value = event.target.value;


      _this.setState({ amPm: value }, _this.onChangeExternal);
    }, _this.onChangeKeyEvent = function (proposedValue) {
      var onChange = _this.props.onChange;


      if (!onChange || !_this.isValidTime(proposedValue)) {
        return;
      }
      var processedValue = _this.getProcessedValue(proposedValue);
      return onChange(processedValue, false);
    }, _this.onChangeExternal = function () {
      var onChange = _this.props.onChange;


      if (!onChange) {
        return;
      }

      var formElements = [_this.hour12Input, _this.hour24Input, _this.minuteInput, _this.secondInput, _this.amPmInput].filter(Boolean);

      var formElementsWithoutSelect = formElements.slice(0, -1);
      var activeElement = formElementsWithoutSelect.find(function (el) {
        return document.activeElement === el;
      });

      var values = {};
      formElements.forEach(function (formElement) {
        values[formElement.name] = formElement.value;
      });

      if (formElementsWithoutSelect.every(function (formElement) {
        return !formElement.value;
      })) {
        onChange(null, false);
      } else {
        var hour = ('0' + (values.hour24 || (0, _dates.convert12to24)(values.hour12, values.amPm))).slice(-2);
        var minute = ('0' + (values.minute || 0)).slice(-2);
        var second = ('0' + (values.second || 0)).slice(-2);
        var timeString = hour + ':' + minute + ':' + second;

        if (_this.isValidTime(timeString)) {
          formElementsWithoutSelect.forEach(function (el) {
            return el.setCustomValidity('');
          });
          var processedValue = _this.getProcessedValue(timeString);
          onChange(processedValue, false);
        } else if (activeElement) {
          activeElement.setCustomValidity('Invalid date');
        } else {
          formElementsWithoutSelect.forEach(function (el) {
            return el.setCustomValidity('Invalid range');
          });
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TimeInput, [{
    key: 'getProcessedValue',


    /**
     * Gets current value in a desired format.
     */
    value: function getProcessedValue(value) {
      var nativeValueParser = this.nativeValueParser;


      return nativeValueParser(value);
    }

    /**
     * Returns value type that can be returned with currently applied settings.
     */

  }, {
    key: 'renderHour12',
    value: function renderHour12() {
      var hour = this.state.hour;


      return _react2.default.createElement(_Hour12Input2.default, _extends({
        key: 'hour12'
      }, this.commonInputProps, {
        value: hour
      }));
    }
  }, {
    key: 'renderHour24',
    value: function renderHour24() {
      var hour = this.state.hour;


      return _react2.default.createElement(_Hour24Input2.default, _extends({
        key: 'hour24'
      }, this.commonInputProps, {
        value: hour
      }));
    }
  }, {
    key: 'renderMinute',
    value: function renderMinute() {
      var maxDetail = this.props.maxDetail;

      // Do not display if maxDetail is "hour" or less

      if (allViews.indexOf(maxDetail) < 1) {
        return null;
      }

      var minute = this.state.minute;


      return _react2.default.createElement(_MinuteInput2.default, _extends({
        key: 'minute'
      }, this.commonInputProps, {
        maxDetail: maxDetail,
        value: minute
      }));
    }
  }, {
    key: 'renderSecond',
    value: function renderSecond() {
      var maxDetail = this.props.maxDetail;

      // Do not display if maxDetail is "minute" or less

      if (allViews.indexOf(maxDetail) < 2) {
        return null;
      }

      var second = this.state.second;


      return _react2.default.createElement(_SecondInput2.default, _extends({
        key: 'second'
      }, this.commonInputProps, {
        maxDetail: maxDetail,
        value: second
      }));
    }
  }, {
    key: 'renderAmPm',
    value: function renderAmPm() {
      var amPm = this.state.amPm;


      return _react2.default.createElement(_AmPm2.default, _extends({
        key: 'ampm'
      }, this.commonInputProps, {
        value: amPm,
        onChange: this.onChangeAmPm
      }));
    }
  }, {
    key: 'renderCustomInputs',
    value: function renderCustomInputs() {
      var _this2 = this;

      var divider = this.divider,
          placeholder = this.placeholder;


      return placeholder.split(divider).map(function (part) {
        switch (part) {
          case 'hour-12':
            return _this2.renderHour12();
          case 'hour-24':
            return _this2.renderHour24();
          case 'minute':
            return _this2.renderMinute();
          case 'second':
            return _this2.renderSecond();
          case 'ampm':
            return _this2.renderAmPm();
          default:
            return null;
        }
      }).filter(Boolean).reduce(function (result, element, index) {
        if (index && element.key !== 'ampm') {
          result.push(
          // eslint-disable-next-line react/no-array-index-key
          _react2.default.createElement(
            _Divider2.default,
            { key: 'separator_' + index },
            divider
          ));
        }

        result.push(element);

        return result;
      }, []);
    }
  }, {
    key: 'renderNativeInput',
    value: function renderNativeInput() {
      var _props = this.props,
          disabled = _props.disabled,
          maxTime = _props.maxTime,
          minTime = _props.minTime,
          name = _props.name,
          required = _props.required,
          value = _props.value;


      return _react2.default.createElement(_NativeInput2.default, {
        key: 'time',
        disabled: disabled,
        maxTime: maxTime,
        minTime: minTime,
        name: name,
        onChange: this.onChangeNative,
        required: required,
        value: value,
        valueType: this.valueType
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var className = this.props.className;


      return _react2.default.createElement(
        'div',
        { className: className },
        this.renderCustomInputs()
      );
    }
  }, {
    key: 'valueType',
    get: function get() {
      var maxDetail = this.props.maxDetail;


      return maxDetail;
    }
  }, {
    key: 'nativeValueParser',
    get: function get() {
      switch (this.valueType) {
        case 'hour':
        case 'minute':
          return _dates.getHoursMinutes;
        case 'second':
          return _dates.getHoursMinutesSeconds;
        default:
          throw new Error('Invalid valueType.');
      }
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'divider',
    get: function get() {
      return ':';
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'placeholder',
    get: function get() {
      var locale = this.props.locale;

      if (locale === 'en-US') {
        return 'hour-12:minute:second :ampm';
      }
      return 'hour-24:minute:second';
    }
  }, {
    key: 'commonInputProps',
    get: function get() {
      var _this3 = this;

      var _props2 = this.props,
          className = _props2.className,
          disabled = _props2.disabled,
          isClockOpen = _props2.isClockOpen,
          required = _props2.required;


      return {
        className: className,
        disabled: disabled,
        onChange: this.onChange,
        onKeyDown: this.onKeyDown,
        placeholder: '--',
        // This is only for showing validity when editing
        required: required || isClockOpen,
        itemRef: function itemRef(ref, name) {
          // Save a reference to each input field
          _this3[name + 'Input'] = ref;
        }
      };
    }

    /**
     * Called when non-native date input is changed.
     */


    /**
     * Called when native date input is changed.
     */


    /**
     * Called after internal onChange. Checks input validity. If all fields are valid,
     * calls props.onChange.
     */

  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var nextState = {};

      /**
       * If isClockOpen flag has changed, we have to update it.
       * It's saved in state purely for use in getDerivedStateFromProps.
       */
      if (nextProps.isClockOpen !== prevState.isClockOpen) {
        nextState.isClockOpen = nextProps.isClockOpen;
      }

      /**
       * If the next value is different from the current one  (with an exception of situation in
       * which values provided are limited by minDate and maxDate so that the dates are the same),
       * get a new one.
       */
      var nextValue = nextProps.value;
      if (
      // Toggling calendar visibility resets values
      nextState.isClockOpen // Flag was toggled
      || hoursAreDifferent(nextValue, prevState.value)) {
        if (nextValue) {
          var _convert24to = (0, _dates.convert24to12)((0, _dates.getHours)(nextValue));

          var _convert24to2 = _slicedToArray(_convert24to, 2);

          nextState.amPm = _convert24to2[1];

          nextState.hour = (0, _dates.getHours)(nextValue);
          nextState.minute = (0, _dates.getMinutes)(nextValue);
          nextState.second = (0, _dates.getSeconds)(nextValue);
        } else {
          nextState.amPm = null;
          nextState.hour = null;
          nextState.minute = null;
          nextState.second = null;
        }
        nextState.value = nextValue;
      }

      nextState.minTimeString = '00:00:00';
      if (nextProps.minTime) {
        if (nextProps.minTime instanceof Date) {
          var hour = ('0' + nextProps.minTime.getHours()).slice(-2);
          var minute = ('0' + nextProps.minTime.getMinutes()).slice(-2);
          var second = ('0' + nextProps.minTime.getSeconds()).slice(-2);
          nextState.minTimeString = hour + ':' + minute + ':' + second;
        } else {
          nextState.minTimeString = nextProps.minTime;
        }
      }

      nextState.maxTimeString = '23:59:59';
      if (nextProps.maxTime) {
        if (nextProps.maxTime instanceof Date) {
          var _hour = ('0' + nextProps.maxTime.getHours()).slice(-2);
          var _minute = ('0' + nextProps.maxTime.getMinutes()).slice(-2);
          var _second = ('0' + nextProps.maxTime.getSeconds()).slice(-2);
          nextState.maxTimeString = _hour + ':' + _minute + ':' + _second;
        } else {
          nextState.maxTimeString = nextProps.maxTime;
        }
      }

      return nextState;
    }
  }]);

  return TimeInput;
}(_react.PureComponent);

exports.default = TimeInput;


TimeInput.defaultProps = {
  maxDetail: 'minute',
  name: 'time'
};

TimeInput.propTypes = {
  className: _propTypes2.default.string.isRequired,
  disabled: _propTypes2.default.bool,
  isClockOpen: _propTypes2.default.bool,
  locale: _propTypes2.default.string,
  maxDetail: _propTypes2.default.oneOf(allViews),
  maxTime: _propTypes3.isTime,
  minTime: _propTypes3.isTime,
  name: _propTypes2.default.string,
  onChange: _propTypes2.default.func,
  required: _propTypes2.default.bool,
  value: _propTypes2.default.oneOfType([_propTypes3.isTime, _propTypes2.default.instanceOf(Date)])
};

(0, _reactLifecyclesCompat.polyfill)(TimeInput);