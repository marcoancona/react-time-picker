import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import { updateInputWidth } from '../shared/utils';

const select = element => element && element.select();

export default class SecondInput extends PureComponent {

  render() {
    const {
      className, disabled, itemRef, onChange, onKeyDown, required, value,
    } = this.props;

    const name = 'second';
    let v = !isNaN(parseInt(value, 10)) ? parseInt(value, 10).toString().slice(-2) : '';
    if (v.length === 1) v = `0${v}`;

    return [
      <input
        key="second"
        className={mergeClassNames(
          `${className}__input`,
          `${className}__second`,
        )}
        disabled={disabled}
        name={name}
        onChange={onChange}
        onFocus={event => select(event.target)}
        onMouseDown={(event) => { event.preventDefault(); select(event.target); }}
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
      />,
    ];
  }
}

SecondInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
};
