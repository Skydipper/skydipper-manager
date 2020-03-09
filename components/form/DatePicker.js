import React from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import isDate from 'date-fns/isDate';
import isValid from 'date-fns/isValid';
import dateFnsParse from 'date-fns/parse';
import dateFnsFormat from 'date-fns/format';
import { enUS } from 'date-fns/locale';

import FormElement from './FormElement';

export const FORMAT = 'yyyy-MM-dd';

const LOCALES = {
  en: enUS,
};

const exists = variable => variable !== null && variable !== undefined;

/**
 * Parse a string as a Date object
 * @param {string} str String to parse
 * @param {string} format Format of the date (see date-fns formats)
 */
const parseDate = (str, format) => {
  // This condition is necessary since date-fns doesn't strictly parse the dates
  // anymore:
  // https://github.com/date-fns/date-fns/issues/942
  if (str.length !== format.length) {
    return undefined;
  }

  const parsed = dateFnsParse(str, format, new Date());
  if (isDate(parsed) && isValid(parsed)) {
    return parsed;
  }

  return undefined;
};

/**
 * Serialise a Date object as a string following a specific format
 * @param {Date} date Date to format
 * @param {string} format Format of the date (see date-fns formats)
 */
const formatDate = (date, format) => {
  const locale = LOCALES.en;
  return dateFnsFormat(date, format, { locale });
};

class DatePicker extends FormElement {
  static propTypes = {
    validations: PropTypes.array,
    properties: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onValid: PropTypes.func.isRequired,
  };

  static defaultProps = {
    validations: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.properties.default || null,
    };
  }

  triggerChange(selectedDay) {
    const { onChange } = this.props;

    const value = exists(selectedDay) ? formatDate(selectedDay, FORMAT) : undefined;
    this.setState({ value: selectedDay });
    this.triggerValidate();
    if (onChange) onChange(value);
  }

  render() {
    const { properties } = this.props;

    const { value } = this.state;

    /**
      @type {import('react-day-picker/types/common').BeforeAfterModifier}
    */
    const disabledDays = ({});

    if (exists(properties.before)) {
      disabledDays.after = isDate(properties.before)
        ? properties.before
        : parseDate(properties.before, FORMAT);
    }

    if (exists(properties.after)) {
      disabledDays.before = isDate(properties.after)
        ? properties.after
        : parseDate(properties.after, FORMAT);
    }

    return (
      <DayPickerInput
        classNames={{
          container: 'DayPickerInput c-form-datepicker',
          overlayWrapper: 'DayPickerInput-OverlayWrapper',
          overlay: 'DayPickerInput-Overlay',
        }}
        format={FORMAT}
        formatDate={formatDate}
        parseDate={parseDate}
        placeholder={`${formatDate(new Date(), FORMAT)}`}
        value={value}
        dayPickerProps={{
          disabledDays,
        }}
        onDayChange={this.triggerChange}
        inputProps={{
          id: `input-${properties.name}`,
          ...properties,
        }}
      />
    );
  }
}

export default DatePicker;
