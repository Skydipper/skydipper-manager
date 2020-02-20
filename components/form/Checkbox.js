import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../ui/Icon';

import FormElement from './FormElement';

export default class Checkbox extends FormElement {
  triggerChange(e) {
    const value = e.currentTarget.checked;

    this.setState({ value }, () => {
      if (this.props.onChange) {
        this.props.onChange({
          checked: value,
        });
      }
    });
  }

  render() {
    const { name, title, className } = this.props.properties;
    const { value } = this.state;

    const customClassName = classnames({
      [className]: !!className,
    });

    return (
      <div className={`c-checkbox ${customClassName}`}>
        <input
          {...this.props.properties}
          type="checkbox"
          id={`checkbox-${name}-${value}`}
          checked={value}
          onChange={this.triggerChange}
        />
        <label htmlFor={`checkbox-${name}-${value}`}>
          <span className="checkbox-icon">
            <Icon name="icon-checkbox" />
          </span>
          <span className="item-title">{title}</span>
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  properties: PropTypes.object,
  onChange: PropTypes.func,
};
