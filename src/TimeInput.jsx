import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import Divider from './Divider';
import Hour12Input from './TimeInput/Hour12Input';
import Hour24Input from './TimeInput/Hour24Input';
import MinuteInput from './TimeInput/MinuteInput';
import SecondInput from './TimeInput/SecondInput';
import NativeInput from './TimeInput/NativeInput';
import AmPm from './TimeInput/AmPm';

import { formatTime } from './shared/dateFormatter';
import {
  getHours,
  getMinutes,
  getSeconds,
  getHoursMinutes,
  getHoursMinutesSeconds,
  convert12to24,
  convert24to12,
} from './shared/dates';
import { isTime } from './shared/propTypes';

const allViews = ['hour', 'minute', 'second'];

const hoursAreDifferent = (date1, date2) => (
  (date1 && !date2)
  || (!date1 && date2)
  || (date1 && date2 && date1 !== date2) // TODO: Compare 11:22:00 and 11:22 properly
);

const findPreviousInput = (element) => {
  const previousElement = element.previousElementSibling; // Divider between inputs
  if (!previousElement) {
    return null;
  }
  return previousElement.previousElementSibling; // Actual input
};

const findNextInput = (element) => {
  const nextElement = element.nextElementSibling; // Divider between inputs
  if (!nextElement) {
    return null;
  }
  return nextElement.nextElementSibling; // Actual input
};

const focus = element => element && element.focus();

const removeUnwantedCharacters = str => str
  .split('')
  .filter(a => (
    // We don't want spaces in dates
    a.charCodeAt(0) !== 32
    // Internet Explorer specific
    && a.charCodeAt(0) !== 8206
    // Remove non-ASCII characters
    && /^[\x20-\x7F]*$/.test(a)
  ))
  .join('');

export default class TimeInput extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {};

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
    const nextValue = nextProps.value;
    if (
      // Toggling calendar visibility resets values
      nextState.isClockOpen // Flag was toggled
      || hoursAreDifferent(nextValue, prevState.value)
    ) {
      if (nextValue) {
        [, nextState.amPm] = convert24to12(getHours(nextValue));
        nextState.hour = getHours(nextValue);
        nextState.minute = getMinutes(nextValue);
        nextState.second = getSeconds(nextValue);
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
        const hour = `0${nextProps.minTime.getHours()}`.slice(-2);
        const minute = `0${nextProps.minTime.getMinutes()}`.slice(-2);
        const second = `0${nextProps.minTime.getSeconds()}`.slice(-2);
        nextState.minTimeString = `${hour}:${minute}:${second}`;
      }
      else {
        nextState.minTimeString = nextProps.minTime;
      }
    }

    nextState.maxTimeString = '23:59:59';
    if (nextProps.maxTime) {
      if (nextProps.maxTime instanceof Date) {
        const hour = `0${nextProps.maxTime.getHours()}`.slice(-2);
        const minute = `0${nextProps.maxTime.getMinutes()}`.slice(-2);
        const second = `0${nextProps.maxTime.getSeconds()}`.slice(-2);
        nextState.maxTimeString = `${hour}:${minute}:${second}`;
      }
      else {
        nextState.maxTimeString = nextProps.maxTime;
      }
    }

    return nextState;
  }

  state = {
    amPm: null,
    hour: null,
    minute: null,
    second: null,
  };

  /**
   * Gets current value in a desired format.
   */
  getProcessedValue(value) {
    const { nativeValueParser } = this;

    return nativeValueParser(value);
  }

  /**
   * Returns value type that can be returned with currently applied settings.
   */
  get valueType() {
    const { maxDetail } = this.props;

    return maxDetail;
  }

  get nativeValueParser() {
    switch (this.valueType) {
      case 'hour':
      case 'minute':
        return getHoursMinutes;
      case 'second':
        return getHoursMinutesSeconds;
      default:
        throw new Error('Invalid valueType.');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get divider() {
    return ':';
  }

  // eslint-disable-next-line class-methods-use-this
  get placeholder() {
    const { locale } = this.props;
    if (locale === 'en-US') {
      return 'hour-12:minute:second :ampm';
    }
    return 'hour-24:minute:second';
  }

  get commonInputProps() {
    const {
      className,
      disabled,
      isClockOpen,
      required,
    } = this.props;

    return {
      className,
      disabled,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      placeholder: '--',
      // This is only for showing validity when editing
      required: required || isClockOpen,
      itemRef: (ref, name) => {
        // Save a reference to each input field
        this[`${name}Input`] = ref;
      },
    };
  }

  isValidTime = (timeString) => {
    const { minTimeString, maxTimeString } = this.state;
    return (Date.parse(`1990-01-01T${timeString}`) && timeString >= minTimeString && timeString <= maxTimeString);
  }

  onKeyDown = (event) => {
    let offset = null;
    switch (event.key) {
      case 'ArrowUp': {
        offset = 1;
      }
      case 'ArrowDown': {
        event.preventDefault();
        if (!offset) offset = -1;
        const key = event.target.name;
        const { hour, minute, second } = this.state;
        let hourString = `0${hour}`.slice(-2);
        let minuteString = `0${minute}`.slice(-2);
        let secondString = `0${second}`.slice(-2);
        const nextValue = new Date(`1900-01-01T${hourString}:${minuteString}:${secondString}`);
        if (key === 'second') {
          nextValue.setSeconds(nextValue.getSeconds() + offset);
        }
        else if (key === 'minute') {
          nextValue.setMinutes(nextValue.getMinutes() + offset);
        }
        else if (key === 'hour12' || key === 'hour24') {
          nextValue.setHours(nextValue.getHours() + offset);
        }
        hourString = `0${nextValue.getHours()}`.slice(-2);
        minuteString = `0${nextValue.getMinutes()}`.slice(-2);
        secondString = `0${nextValue.getSeconds()}`.slice(-2);
        const timeString = `${hourString}:${minuteString}:${secondString}`;
        this.onChangeKeyEvent(timeString);
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();

        const input = event.target;
        const previousInput = findPreviousInput(input);
        focus(previousInput);
        break;
      }
      case 'ArrowRight':
      case this.divider: {
        event.preventDefault();

        const input = event.target;
        const nextInput = findNextInput(input);
        focus(nextInput);
        break;
      }
      default:
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  onChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'hour12': {
        this.setState(
          prevState => ({
            hour: value ? convert12to24(parseInt(value, 10), prevState.amPm) : null,
          }),
          this.onChangeExternal,
        );
        break;
      }
      case 'hour24': {
        this.setState(
          { hour: value ? parseInt(value, 10) : null },
          this.onChangeExternal,
        );
        break;
      }
      default: {
        this.setState(
          { [name]: value ? parseInt(value, 10) : null },
          this.onChangeExternal,
        );
      }
    }
  }

  /**
   * Called when native date input is changed.
   */
  onChangeNative = (event) => {
    const { onChange } = this.props;
    const { value } = event.target;

    if (!onChange) {
      return;
    }

    const processedValue = (() => {
      if (!value) {
        return null;
      }

      return value;
    })();

    onChange(processedValue, false);
  }

  onChangeAmPm = (event) => {
    const { value } = event.target;

    this.setState(
      ({ amPm: value }),
      this.onChangeExternal,
    );
  }

  onChangeKeyEvent = (proposedValue) => {
    const { onChange } = this.props;

    if (!onChange || !this.isValidTime(proposedValue)) {
      return;
    }
    const processedValue = this.getProcessedValue(proposedValue);
    return onChange(processedValue, false);
  }

  /**
   * Called after internal onChange. Checks input validity. If all fields are valid,
   * calls props.onChange.
   */
  onChangeExternal = () => {
    const { onChange } = this.props;

    if (!onChange) {
      return;
    }

    const formElements = [
      this.hour12Input,
      this.hour24Input,
      this.minuteInput,
      this.secondInput,
      this.amPmInput,
    ].filter(Boolean);

    const formElementsWithoutSelect = formElements.slice(0, -1);
    const activeElement = formElementsWithoutSelect.find(el => document.activeElement === el);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] = formElement.value;
    });

    if (formElementsWithoutSelect.every(formElement => !formElement.value)) {
      onChange(null, false);
    } else {
      const hour = `0${values.hour24 || convert12to24(values.hour12, values.amPm)}`.slice(-2);
      const minute = `0${values.minute || 0}`.slice(-2);
      const second = `0${values.second || 0}`.slice(-2);
      const timeString = `${hour}:${minute}:${second}`;

      if (this.isValidTime(timeString)) {
        formElementsWithoutSelect.forEach(el => el.setCustomValidity(''));
        const processedValue = this.getProcessedValue(timeString);
        onChange(processedValue, false);
      }
      else if (activeElement) {
        activeElement.setCustomValidity('Invalid date');
      }
      else {
        formElementsWithoutSelect.forEach(el => el.setCustomValidity('Invalid range'));
      }
    }
  }

  renderHour12() {
    const { hour } = this.state;

    return (
      <Hour12Input
        key="hour12"
        {...this.commonInputProps}
        value={hour}
      />
    );
  }

  renderHour24() {
    const { hour } = this.state;

    return (
      <Hour24Input
        key="hour24"
        {...this.commonInputProps}
        value={hour}
      />
    );
  }

  renderMinute() {
    const { maxDetail } = this.props;

    // Do not display if maxDetail is "hour" or less
    if (allViews.indexOf(maxDetail) < 1) {
      return null;
    }

    const { minute } = this.state;

    return (
      <MinuteInput
        key="minute"
        {...this.commonInputProps}
        maxDetail={maxDetail}
        value={minute}
      />
    );
  }

  renderSecond() {
    const { maxDetail } = this.props;

    // Do not display if maxDetail is "minute" or less
    if (allViews.indexOf(maxDetail) < 2) {
      return null;
    }

    const { second } = this.state;

    return (
      <SecondInput
        key="second"
        {...this.commonInputProps}
        maxDetail={maxDetail}
        value={second}
      />
    );
  }

  renderAmPm() {
    const { amPm } = this.state;

    return (
      <AmPm
        key="ampm"
        {...this.commonInputProps}
        value={amPm}
        onChange={this.onChangeAmPm}
      />
    );
  }

  renderCustomInputs() {
    const { divider, placeholder } = this;

    return (
      placeholder
        .split(divider)
        .map((part) => {
          switch (part) {
            case 'hour-12': return this.renderHour12();
            case 'hour-24': return this.renderHour24();
            case 'minute': return this.renderMinute();
            case 'second': return this.renderSecond();
            case 'ampm': return this.renderAmPm();
            default: return null;
          }
        })
        .filter(Boolean)
        .reduce((result, element, index) => {
          if (index && element.key !== 'ampm') {
            result.push(
              // eslint-disable-next-line react/no-array-index-key
              <Divider key={`separator_${index}`}>
                {divider}
              </Divider>,
            );
          }

          result.push(element);

          return result;
        }, [])
    );
  }

  renderNativeInput() {
    const {
      disabled,
      maxTime,
      minTime,
      name,
      required,
      value,
    } = this.props;

    return (
      <NativeInput
        key="time"
        disabled={disabled}
        maxTime={maxTime}
        minTime={minTime}
        name={name}
        onChange={this.onChangeNative}
        required={required}
        value={value}
        valueType={this.valueType}
      />
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        {this.renderCustomInputs()}
      </div>
    );
  }
}

TimeInput.defaultProps = {
  maxDetail: 'minute',
  name: 'time',
};

TimeInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isClockOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDetail: PropTypes.oneOf(allViews),
  maxTime: isTime,
  minTime: isTime,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    isTime,
    PropTypes.instanceOf(Date),
  ]),
};

polyfill(TimeInput);
