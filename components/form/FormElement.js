import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

import Validator from './Validator';

class FormElement extends PureComponent {
  static propTypes = {
    validations: PropTypes.array,
    properties: PropTypes.object.isRequired,
    onValid: PropTypes.func.isRequired,
  };

  static defaultProps = {
    validations: [],
  };

  constructor(props) {
    super(props);

    this.validator = new Validator();

    this.state = {
      value:
        props.properties.default === null || props.properties.default === undefined
          ? ''
          : props.properties.default,
    };

    this.triggerChange = this.triggerChange.bind(this);
    this.triggerValidate = this.triggerValidate.bind(this);
  }

  componentDidMount() {
    const { value } = this.state;

    if (value && value.length) {
      this.triggerValidate();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.state;

    const hasValue = Object.prototype.hasOwnProperty.call(nextProps.properties, 'value');
    const isNew = nextProps.properties.value !== value;

    if (hasValue && isNew) {
      this.setState(
        {
          value: nextProps.properties.value,
        },
        () => {
          this.triggerValidate();
        }
      );
    }
  }

  componentDidUpdate(prevProps) {
    const prevPropsParsed = pick(prevProps, ['properties', 'validations']);
    const currentPropsParsed = pick(this.props, ['properties', 'validations']);

    if (!isEqual(prevPropsParsed, currentPropsParsed)) {
      this.triggerValidate();
    }
  }

  triggerValidate() {
    const { validations, onValid } = this.props;
    const { value } = this.state;

    let valid = true;
    let errors = [];

    if (validations) {
      const validateArr = this.validator.validate(validations, value);
      valid = validateArr.every(element => element.valid);
      errors = !valid ? validateArr.map(element => element.error) : [];
    }

    onValid(valid, errors);

    return { valid, errors };
  }
}

export default FormElement;
