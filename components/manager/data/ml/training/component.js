import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';

import Spinner from 'components/ui/Spinner';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import Select from 'components/form/SelectInput';
import DatePicker from 'components/form/DatePicker';
import Navigation from 'components/form/Navigation';
import MapInput from './map-input/component';
import MapSelect from './map-select/component';
import {
  FORM_ELEMENTS,
  NORMALIZATION_TYPES,
  INPUT_TYPES,
  MODEL_TYPES_BY_INPUT_TYPE,
  OUTPUT_TYPES_BY_MODEL_TYPE,
  MODEL_ARCHITECTURES_BY_MODEL_TYPE_AND_OUTPUT_TYPE,
} from './constants';

import './style.scss';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FORM_VALID':
      return { ...state, formInvalid: false };
    case 'FORM_INVALID':
      return { ...state, formInvalid: true };
    case 'FORM_SUBMIT_INIT':
      return {
        ...state,
        formLoading: true,
        formSuccess: false,
        formError: false,
        formInvalid: false,
      };
    case 'FORM_SUBMIT_SUCCESS':
      return { ...state, formLoading: false, formSuccess: true };
    case 'FORM_SUBMIT_FAILURE':
      return { ...state, formLoading: false, formError: true };
    case 'FORM_UPDATE':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'DATASETS_INPUT_SELECT':
      return {
        ...state,
        form: { ...state.form, inputDataset: state.datasets.find(d => d.name === action.payload) },
      };
    case 'DATASETS_OUTPUT_SELECT':
      return {
        ...state,
        form: { ...state.form, outputDataset: state.datasets.find(d => d.name === action.payload) },
      };
    case 'BANDS_INPUT_SELECT':
      // TODO: real code
      return { ...state, form: { ...state.form, inputBands: action.payload } };
    case 'BANDS_OUTPUT_SELECT':
      // TODO: real code
      return { ...state, form: { ...state.form, outputBands: action.payload } };
    default:
      return state;
  }
};

const MLTraining = ({ token }) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: false,
    formLoading: false,
    formInvalid: false,
    formSuccess: false,
    formError: false,
    datasets: [],
    form: {
      name: null,
      description: null,
      batchSize: 1,
      epochs: 1,
      normalization: null,
      inputDataset: null,
      outputDataset: null,
      startDate: null,
      endDate: null,
      geojson: null,
    },
  });

  const [step] = useState(1);
  const [stepsCount] = useState(1);

  const onSubmit = e => {
    e.preventDefault();

    // Validate the form
    const valid = FORM_ELEMENTS.validate();

    if (!valid) {
      dispatch({ type: 'FORM_INVALID' });
    } else {
      // TODO
      // dispatch({ type: 'FORM_SUBMIT_INIT' });
      // dispatch({ type: 'FORM_SUBMIT_SUCCESS' });
      // dispatch({ type: 'FORM_SUBMIT_FAILURE' });
    }
  };

  return (
    <form className="c-form c-ml-training" onSubmit={onSubmit} noValidate>
      <Spinner isLoading={state.loading || state.formLoading} className="-light" />

      {state.error && <div className="callout alert small">Unable to load the data</div>}

      {state.formError && <div className="callout alert small">Unable to save the form</div>}

      {state.formInvalid && (
        <div className="callout alert small">
          Fill all the required fields or correct the invalid values
        </div>
      )}

      <fieldset className="c-field-container">
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.inputDataset = c;
            }
          }}
          onChange={value => dispatch({ type: 'DATASETS_INPUT_SELECT', payload: value })}
          className="-fluid"
          validations={['required']}
          options={state.datasets}
          properties={{
            name: 'inputDataset',
            label: 'Input dataset',
            default: state.form.inputDataset,
            required: true,
          }}
        >
          {Select}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.outputDataset = c;
            }
          }}
          onChange={value => dispatch({ type: 'DATASETS_OUTPUT_SELECT', payload: value })}
          className="-fluid"
          validations={['required']}
          options={state.datasets}
          properties={{
            name: 'outputDataset',
            label: 'Output dataset',
            default: state.form.outputDataset,
            required: true,
          }}
        >
          {Select}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.startDate = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { startDate: value } })}
          className="-fluid"
          validations={['required']}
          properties={{
            name: 'startDate',
            label: 'Start date',
            default: state.form.startDate,
            before: state.form.endDate,
            required: true,
          }}
        >
          {DatePicker}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.endDate = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { endDate: value } })}
          className="-fluid"
          validations={['required']}
          properties={{
            name: 'endDate',
            label: 'End date',
            default: state.form.endDate,
            after: state.form.startDate,
            required: true,
          }}
        >
          {DatePicker}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.geojson = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { geojson: value } })}
          className="-fluid"
          validations={[
            { type: 'min-n-geo', data: 3, condition: `You must draw at least 3 geometries` },
          ]}
          hint="Please draw at least 3 geometries that will be used for the training, the validation and testing. Click the first point to close a shape."
          properties={{
            name: 'geojson',
            label: 'Geometries',
            // TODO: use real layers
            layers: [],
          }}
        >
          {MapInput}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.normalization = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { normalization: value } })}
          className="-fluid"
          validations={['required']}
          options={NORMALIZATION_TYPES}
          properties={{
            name: 'normalization',
            label: 'Normalization type',
            default: state.form.normalization,
            required: true,
          }}
        >
          {Select}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.inputBands = c;
            }
          }}
          onChange={value => dispatch({ type: 'BANDS_INPUT_SELECT', payload: value })}
          className="-fluid"
          validations={['required']}
          options={[]}
          hint="Select the bands of the input dataset that you want to use for the training."
          properties={{
            name: 'input-bands',
            label: 'Input bands',
            default: state.form.inputBands,
            required: true,
            multi: true,
            // TODO: use real layers
            layers: [],
          }}
        >
          {MapSelect}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.outputBands = c;
            }
          }}
          onChange={value => dispatch({ type: 'BANDS_OUTPUT_SELECT', payload: value })}
          className="-fluid"
          validations={['required']}
          options={[]}
          hint="Select the bands of the output dataset that you want to use for the training."
          properties={{
            name: 'output-bands',
            label: 'Output bands',
            default: state.form.outputBands,
            required: true,
            multi: true,
            // TODO: use real layers
            layers: [],
          }}
        >
          {MapSelect}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.inputType = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { inputType: value } })}
          className="-fluid"
          validations={['required']}
          options={INPUT_TYPES}
          properties={{
            name: 'input-type',
            label: 'Input type',
            default: state.form.inputType,
            required: true,
          }}
        >
          {Select}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.modelType = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { modelType: value } })}
          className="-fluid"
          validations={['required']}
          options={state.form.inputType ? MODEL_TYPES_BY_INPUT_TYPE[state.form.inputType] : []}
          properties={{
            name: 'model-type',
            label: 'Model type',
            default: state.form.modelType,
            required: true,
          }}
        >
          {Select}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.outputType = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { outputType: value } })}
          className="-fluid"
          validations={['required']}
          options={state.form.modelType ? OUTPUT_TYPES_BY_MODEL_TYPE[state.form.modelType] : []}
          properties={{
            name: 'output-type',
            label: 'Output type',
            default: state.form.outputType,
            required: true,
          }}
        >
          {Select}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.modelArchitecture = c;
            }
          }}
          onChange={value =>
            dispatch({ type: 'FORM_UPDATE', payload: { modelArchitecture: value } })
          }
          className="-fluid"
          validations={['required']}
          options={
            state.form.modelType && state.form.outputType
              ? MODEL_ARCHITECTURES_BY_MODEL_TYPE_AND_OUTPUT_TYPE[state.form.modelType][
                  state.form.outputType
                ]
              : []
          }
          properties={{
            name: 'model-architecture',
            label: 'Model architecture',
            default: state.form.modelArchitecture,
            required: true,
          }}
        >
          {Select}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.name = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { name: value } })}
          className="-fluid"
          validations={['required']}
          properties={{
            name: 'name',
            label: 'Model name',
            type: 'text',
            default: state.form.name,
            required: true,
          }}
        >
          {Input}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.description = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { description: value } })}
          className="-fluid"
          validations={['required']}
          properties={{
            name: 'description',
            label: 'Description',
            default: state.form.description,
            required: true,
          }}
        >
          {TextArea}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.batchSize = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { batchSize: value } })}
          className="-fluid"
          validations={['required', { type: 'min', condition: 1, value: state.form.batchSize }]}
          properties={{
            name: 'batch-size',
            label: 'Batch size',
            type: 'number',
            min: 1,
            step: '1',
            pattern: 'd+',
            default: state.form.batchSize,
            required: true,
          }}
        >
          {Input}
        </Field>
        <Field
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.epochs = c;
            }
          }}
          onChange={value => dispatch({ type: 'FORM_UPDATE', payload: { epochs: value } })}
          className="-fluid"
          validations={['required', { type: 'min', condition: 1, value: state.form.epochs }]}
          properties={{
            name: 'epochs',
            label: 'Epochs',
            type: 'number',
            min: 1,
            step: '1',
            pattern: 'd+',
            default: state.form.epochs,
            required: true,
          }}
        >
          {Input}
        </Field>

        {!state.error && !state.loading && (
          <Navigation
            step={step}
            stepLength={stepsCount}
            submitting={state.formLoading}
            onStepChange={() => null}
          />
        )}
      </fieldset>
    </form>
  );
};

MLTraining.propTypes = {
  token: PropTypes.string.isRequired,
};

export default MLTraining;
