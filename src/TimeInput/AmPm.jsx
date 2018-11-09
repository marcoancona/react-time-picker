import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

class AmPm extends PureComponent {
  render() {
    const {
      className, disabled, itemRef, onChange, required, value,
    } = this.props;

    const name = 'amPm';

    return (
      <select
        className={mergeClassNames(
          `${className}__input`,
          `${className}__amPm`,
        )}
        disabled={disabled}
        name={name}
        onChange={onChange}
        ref={(ref) => {
          if (itemRef) {
            itemRef(ref, name);
          }
        }}
        required={required}
        value={value !== null ? value : ''}
      >
        {!value && (
          <option value="">
            --
          </option>
        )}
        <option value="am">
          am
        </option>
        <option value="pm">
          pm
        </option>
      </select>
    );
  }
}

AmPm.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemRef: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOf(['am', 'pm']),
};

export default AmPm;
