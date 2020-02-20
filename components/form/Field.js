import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Field extends PureComponent {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    children: PropTypes.elementType.isRequired,
    className: PropTypes.string,
    hint: PropTypes.string,
    button: PropTypes.element,
  };

  static defaultProps = {
    className: null,
    hint: null,
    button: null,
  };

  state = {
    valid: true,
    errors: [],
  };

  constructor(props) {
    super(props);

    this.onValid = this.onValid.bind(this);
  }

  onValid(valid, errors) {
    this.setState({
      valid,
      errors,
    });
  }

  validate() {
    const { valid } = this.child.triggerValidate();
    return valid;
  }

  isValid() {
    const { valid } = this.state;
    return valid;
  }

  render() {
    const { properties, children, className, hint, button } = this.props;
    const { valid, errors } = this.state;

    const fieldClasses = classnames({
      [className]: !!className,
      '-disabled': !!properties.disabled,
      '-valid': valid === true,
      '-error': valid === false,
    });

    const Children = children;

    return (
      <div className={`c-field ${fieldClasses}`}>
        {properties.label && (
          <label htmlFor={`input-${properties.name}`} className="label">
            {properties.label} {properties.required && <abbr title="required">*</abbr>}
          </label>
        )}

        {hint && <p className="hint" dangerouslySetInnerHTML={{ __html: hint }} />}

        <div className="field-container">
          {React.isValidElement(children) && children}
          {children && typeof children === 'function' && (
            <Children
              {...this.props}
              ref={node => {
                if (node) {
                  this.child = node;
                }
              }}
              onValid={this.onValid}
            />
          )}

          {!!button && button}
        </div>

        {errors
          .filter(error => !!error)
          .map(err => {
            return (
              <p key={err.message || err.detail} className="error">
                {err.message || err.detail}
              </p>
            );
          })}
      </div>
    );
  }
}

export default Field;
