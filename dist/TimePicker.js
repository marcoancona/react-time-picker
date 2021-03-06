'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _makeEventProps = require('make-event-props');

var _makeEventProps2 = _interopRequireDefault(_makeEventProps);

var _mergeClassNames = require('merge-class-names');

var _mergeClassNames2 = _interopRequireDefault(_mergeClassNames);

var _detectElementOverflow = require('detect-element-overflow');

var _detectElementOverflow2 = _interopRequireDefault(_detectElementOverflow);

var _entry = require('react-clock/dist/entry.nostyle');

var _entry2 = _interopRequireDefault(_entry);

var _TimeInput = require('./TimeInput');

var _TimeInput2 = _interopRequireDefault(_TimeInput);

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var allViews = ['hour', 'minute', 'second'];
var baseClassName = 'react-time-picker';

var TimePicker = function (_PureComponent) {
  _inherits(TimePicker, _PureComponent);

  function TimePicker() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TimePicker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TimePicker.__proto__ || Object.getPrototypeOf(TimePicker)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.onClick = function (event) {
      if (_this.wrapper && !_this.wrapper.contains(event.target)) {
        _this.closeClock();
      }
    }, _this.openClock = function () {
      _this.setState({ isOpen: true });
    }, _this.closeClock = function () {
      _this.setState(function (prevState) {
        if (!prevState.isOpen) {
          return null;
        }

        return { isOpen: false };
      });
    }, _this.toggleClock = function () {
      _this.setState(function (prevState) {
        return { isOpen: !prevState.isOpen };
      });
    }, _this.onChange = function (value) {
      var closeClock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      _this.setState({
        isOpen: !closeClock
      });

      var onChange = _this.props.onChange;

      if (onChange) {
        onChange(value);
      }
    }, _this.onFocus = function (event) {
      var _this$props = _this.props,
          disabled = _this$props.disabled,
          onFocus = _this$props.onFocus;


      if (onFocus) {
        onFocus(event);
      }

      // Internet Explorer still fires onFocus on disabled elements
      if (disabled) {
        return;
      }

      _this.openClock();
    }, _this.stopPropagation = function (event) {
      return event.stopPropagation();
    }, _this.clear = function () {
      return _this.onChange(null);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TimePicker, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('mousedown', this.onClick);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mousedown', this.onClick);
    }
  }, {
    key: 'renderInputs',
    value: function renderInputs() {
      var _props = this.props,
          clearIcon = _props.clearIcon,
          clockIcon = _props.clockIcon,
          disableClock = _props.disableClock,
          disabled = _props.disabled,
          isOpen = _props.isOpen,
          locale = _props.locale,
          maxDetail = _props.maxDetail,
          maxTime = _props.maxTime,
          minTime = _props.minTime,
          name = _props.name,
          required = _props.required,
          value = _props.value;


      return _react2.default.createElement(
        'div',
        { className: baseClassName + '__wrapper' },
        _react2.default.createElement(_TimeInput2.default, {
          className: baseClassName + '__inputGroup',
          disabled: disabled,
          locale: locale,
          isClockOpen: isOpen,
          maxDetail: maxDetail,
          maxTime: maxTime,
          minTime: minTime,
          name: name,
          onChange: this.onChange,
          placeholder: this.placeholder,
          required: required,
          value: value
        }),
        clearIcon !== null && _react2.default.createElement(
          'button',
          {
            className: baseClassName + '__clear-button ' + baseClassName + '__button',
            disabled: disabled,
            onClick: this.clear,
            onFocus: this.stopPropagation,
            type: 'button'
          },
          clearIcon
        ),
        clockIcon !== null && !disableClock && _react2.default.createElement(
          'button',
          {
            className: baseClassName + '__clock-button ' + baseClassName + '__button',
            disabled: disabled,
            onClick: this.toggleClock,
            onFocus: this.stopPropagation,
            onBlur: this.resetValue,
            type: 'button'
          },
          clockIcon
        )
      );
    }
  }, {
    key: 'renderClock',
    value: function renderClock() {
      var _this2 = this;

      var disableClock = this.props.disableClock;
      var isOpen = this.state.isOpen;


      if (isOpen === null || disableClock) {
        return null;
      }

      var _props2 = this.props,
          clockClassName = _props2.clockClassName,
          timePickerClassName = _props2.className,
          maxDetail = _props2.maxDetail,
          onChange = _props2.onChange,
          clockProps = _objectWithoutProperties(_props2, ['clockClassName', 'className', 'maxDetail', 'onChange']);

      var className = baseClassName + '__clock';

      var maxDetailIndex = allViews.indexOf(maxDetail);

      return _react2.default.createElement(
        'div',
        {
          className: (0, _mergeClassNames2.default)(className, className + '--' + (isOpen ? 'open' : 'closed')),
          ref: function ref(_ref2) {
            if (!_ref2 || !isOpen) {
              return;
            }

            _ref2.classList.remove(className + '--above-label');

            var collisions = (0, _detectElementOverflow2.default)(_ref2, document.body);

            if (collisions.collidedBottom) {
              var overflowTopAfterChange = collisions.overflowTop + _ref2.clientHeight + _this2.wrapper.clientHeight;

              // If it's going to make situation any better, display the calendar above the input
              if (overflowTopAfterChange < collisions.overflowBottom) {
                _ref2.classList.add(className + '--above-label');
              }
            }
          }
        },
        _react2.default.createElement(_entry2.default, _extends({
          className: clockClassName,
          renderMinuteHand: maxDetailIndex > 0,
          renderSecondHand: maxDetailIndex > 1
        }, clockProps))
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props3 = this.props,
          className = _props3.className,
          disabled = _props3.disabled;
      var isOpen = this.state.isOpen;


      return _react2.default.createElement(
        'div',
        _extends({
          className: (0, _mergeClassNames2.default)(baseClassName, baseClassName + '--' + (isOpen ? 'open' : 'closed'), baseClassName + '--' + (disabled ? 'disabled' : 'enabled'), className)
        }, this.eventProps, {
          onFocus: this.onFocus,
          ref: function ref(_ref3) {
            _this3.wrapper = _ref3;
          }
        }),
        this.renderInputs(),
        this.renderClock()
      );
    }
  }, {
    key: 'eventProps',
    get: function get() {
      return (0, _makeEventProps2.default)(this.props);
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.isOpen !== prevState.isOpenProps) {
        return {
          isOpen: nextProps.isOpen,
          isOpenProps: nextProps.isOpen
        };
      }

      return null;
    }
  }]);

  return TimePicker;
}(_react.PureComponent);

exports.default = TimePicker;


var ClockIcon = _react2.default.createElement(
  'svg',
  { xmlns: 'http://www.w3.org/2000/svg', width: '19', height: '19', viewBox: '0 0 19 19' },
  _react2.default.createElement(
    'g',
    { stroke: 'black', strokeWidth: '2', fill: 'none' },
    _react2.default.createElement('circle', { cx: '9.5', cy: '9.5', r: '7.5' }),
    _react2.default.createElement('path', { d: 'M9.5 4.5 v5 h4' })
  )
);

var ClearIcon = _react2.default.createElement(
  'svg',
  { xmlns: 'http://www.w3.org/2000/svg', width: '19', height: '19', viewBox: '0 0 19 19' },
  _react2.default.createElement(
    'g',
    { stroke: 'black', strokeWidth: '2' },
    _react2.default.createElement('line', { x1: '4', y1: '4', x2: '15', y2: '15' }),
    _react2.default.createElement('line', { x1: '15', y1: '4', x2: '4', y2: '15' })
  )
);

TimePicker.defaultProps = {
  clearIcon: ClearIcon,
  clockIcon: ClockIcon,
  isOpen: null,
  maxDetail: 'minute'
};

TimePicker.propTypes = _extends({}, _entry2.default.propTypes, {
  clockClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
  clockIcon: _propTypes2.default.node,
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
  clearIcon: _propTypes2.default.node,
  disabled: _propTypes2.default.bool,
  disableClock: _propTypes2.default.bool,
  isOpen: _propTypes2.default.bool,
  locale: _propTypes2.default.string,
  maxDetail: _propTypes2.default.oneOf(allViews),
  maxTime: _propTypes3.isTime,
  minTime: _propTypes3.isTime,
  name: _propTypes2.default.string,
  onChange: _propTypes2.default.func,
  required: _propTypes2.default.bool,
  value: _propTypes2.default.oneOfType([_propTypes3.isTime, _propTypes2.default.instanceOf(Date)])
});

(0, _reactLifecyclesCompat.polyfill)(TimePicker);