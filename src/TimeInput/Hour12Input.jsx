import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import {
  convert24to12,
} from '../shared/dates';
import { updateInputWidth } from '../shared/utils';

const select = element => element && element.select();

export default class Hour12Input extends PureComponent {

  render() {
    const {
      className, disabled, itemRef, onChange, onKeyDown, required, value,
    } = this.props;

    const name = 'hour12';
    const v = value != null ? convert24to12(value)[0] : '';

    return (
      <input
        className={mergeClassNames(
          `${className}__input`,
          `${className}__hour`,
        )}
        disabled={disabled}
        name={name}
        onChange={onChange}
        onFocus={event => select(event.target)}
        onKeyDown={onKeyDown}
        onKeyUp={event => updateInputWidth(event.target)}
        placeholder="--"
        ref={(ref) => {
          if (ref) {
            updateInputWidth(ref);
          }

          if (itemRef) {
            itemRef(ref, name);
          }
        }}
        required={required}
        value={v}
      />
    );
  }
}

Hour12Input.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
};
