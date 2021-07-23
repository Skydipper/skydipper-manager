import React, { useReducer, useState, useMemo, useEffect } from 'react';
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
  DATASETS_MOCK,
  INPUT_OUTPUT_IMAGES_MOCK,
  INPUT_OUTPUT_BANDS_MOCK,
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
    case 'DATASETS_FETCH_INIT':
      return { ...state, loading: true, error: false };
    case 'DATASETS_FETCH_SUCCESS':
      return { ...state, loading: false, error: false, datasets: action.payload };
    case 'DATASETS_FETCH_FAILURE':
      return { ...state, loading: false, error: true };
    case 'INPUT_OUTPUT_IMAGES_FETCH_INIT':
      return { ...state, loading: true, error: false };
    case 'INPUT_OUTPUT_IMAGES_FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        inputImage: action.payload.input_image,
        outputImage: action.payload.output_image,
      };
    case 'INPUT_OUTPUT_IMAGES_FETCH_FAILURE':
      return { ...state, loading: false, error: true };
    case 'INPUT_OUTPUT_BANDS_FETCH_INIT':
      return { ...state, loading: true, error: false };
    case 'INPUT_OUTPUT_BANDS_FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        inputBands: Object.keys(action.payload.norm_bands.input_bands).reduce(
          (res, key) => ({
            ...res,
            [JSON.parse(key.replace(/'/g, '"')).join(', ')]: action.payload.norm_bands.input_bands[
              key
            ],
          }),
          {}
        ),
        outputBands: Object.keys(action.payload.norm_bands.output_bands).reduce(
          (res, key) => ({
            ...res,
            [JSON.parse(key.replace(/'/g, '"')).join(', ')]: action.payload.norm_bands.output_bands[
              key
            ],
          }),
          {}
        ),
      };
    case 'INPUT_OUTPUT_BANDS_FETCH_FAILURE':
      return { ...state, loading: false, error: true };
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
    inputImage: null,
    outputImage: null,
    inputBands: [],
    outputBands: [],
    form: {
      name: null,
      description: null,
      batchSize: 1,
      epochs: 1,
      normalization: null,
      inputDataset: null,
      outputDataset: null,
      inputBands: [],
      outputBands: [],
      startDate: null,
      endDate: null,
      geojson: null,
    },
  });

  const [step] = useState(1);
  const [stepsCount] = useState(1);

  const datasetOptions = useMemo(
    () =>
      state.datasets
        .map(dataset => ({ label: dataset.name, value: dataset.name }))
        .sort((d1, d2) => d1.label.localeCompare(d2.label)),
    [state.datasets]
  );

  const inputBandOptions = useMemo(
    () =>
      Object.keys(state.inputBands || {}).map(band => ({
        label: band,
        value: band,
      })),
    [state.inputBands]
  );

  const outputBandOptions = useMemo(
    () =>
      Object.keys(state.outputBands || {}).map(band => ({
        label: band,
        value: band,
      })),
    [state.outputBands]
  );

  const geometryMapProperties = useMemo(
    () => ({
      name: 'geojson',
      label: 'Geometries',
      layers:
        state.inputImage && state.outputImage
          ? [
              {
                name: 'Input dataset',
                url: state.inputImage,
              },
              {
                name: 'Output dataset',
                url: state.outputImage,
              },
            ]
          : [],
      bounds:
        state.form.inputDataset && state.form.outputDataset
          ? L.latLngBounds(state.form.inputDataset.bounds).extend(
              L.latLngBounds(state.form.outputDataset.bounds)
            )
          : undefined,
    }),
    [state.inputImage, state.outputImage, state.form.inputDataset, state.form.outputDataset]
  );

  const boundsOverlap = useMemo(
    () =>
      state.form.inputDataset && state.form.outputDataset
        ? L.latLngBounds(state.form.inputDataset.bounds).overlaps(
            L.latLngBounds(state.form.outputDataset.bounds)
          )
        : true,
    [state.form.inputDataset, state.form.outputDataset]
  );

  const onSubmit = e => {
    e.preventDefault();

    // Validate the form
    const valid = FORM_ELEMENTS.validate();

    if (!valid) {
      dispatch({ type: 'FORM_INVALID' });
    } else {
      const { form } = state;

      const body = {
        dataset_names: [form.inputDataset.name, form.outputDataset.name].join(', '),
        init_date: form.startDate,
        end_date: form.endDate,
        geojson: form.geojson,
        norm_type: form.normalization,
        input_bands: form.inputBands.map(({ value }) => value).join(', '),
        output_bands: form.outputBands.map(({ value }) => value).join(', '),
        input_type: form.inputType,
        model_type: form.modelType,
        model_output: form.outputType,
        model_architecture: form.modelArchitecture,
        model_name: form.name,
        model_description: form.description,
        batch_size: form.batchSize,
        epochs: form.epochs,
      };

      dispatch({ type: 'FORM_SUBMIT_INIT' });

      fetch(`${process.env.WRI_API_URL}/geotrainer/jobs`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: JSON.stringify(body),
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then(() => dispatch({ type: 'FORM_SUBMIT_SUCCESS' }))
        .catch(() => dispatch({ type: 'FORM_SUBMIT_FAILURE' }));
    }
  };

  useEffect(() => {
    dispatch({ type: 'DATASETS_FETCH_INIT' });
    // fetch(`${process.env.WRI_API_URL}/geotrainer/dataset`, {
    //   headers: {
    //     Authorization: token,
    //   },
    // })
    // .then(res => {
    //   if (!res.ok) {
    //     throw new Error(`${res.status}: ${res.statusText}`);
    //   }
    //   return res.json();
    // })
    new Promise(resolve => resolve(DATASETS_MOCK))
      .then(({ data }) => dispatch({ type: 'DATASETS_FETCH_SUCCESS', payload: data }))
      .catch(() => dispatch({ type: 'DATASETS_FETCH_FAILURE' }));
  }, [token]);

  useEffect(() => {
    if (
      state.form.inputDataset &&
      state.form.outputDataset &&
      state.form.startDate &&
      state.form.endDate
    ) {
      dispatch({ type: 'INPUT_OUTPUT_IMAGES_FETCH_INIT' });
      // fetch(`${process.env.WRI_API_URL}/geotrainer/composites?init_date=${state.form.startDate}&end_date=${state.form.endDate}&dataset_names=${state.form.inputDataset.name},${state.form.outputDataset.name}`, {
      //   headers: {
      //     Authorization: token,
      //   },
      // })
      // .then(res => {
      //   if (!res.ok) {
      //     throw new Error(`${res.status}: ${res.statusText}`);
      //   }
      //   return res.json();
      // })
      new Promise(resolve => resolve(INPUT_OUTPUT_IMAGES_MOCK))
        .then(({ data }) => dispatch({ type: 'INPUT_OUTPUT_IMAGES_FETCH_SUCCESS', payload: data }))
        .catch(() => dispatch({ type: 'INPUT_OUTPUT_IMAGES_FETCH_FAILURE' }));
    }
  }, [
    token,
    state.form.inputDataset,
    state.form.outputDataset,
    state.form.startDate,
    state.form.endDate,
  ]);

  useEffect(() => {
    if (
      state.form.inputDataset &&
      state.form.outputDataset &&
      state.form.startDate &&
      state.form.endDate &&
      state.form.geojson &&
      state.form.normalization
    ) {
      dispatch({ type: 'INPUT_OUTPUT_BANDS_FETCH_INIT' });
      // fetch(`${process.env.WRI_API_URL}/geotrainer/normalize?init_date=${state.form.startDate}&end_date=${state.form.endDate}&dataset_names=${state.form.inputDataset.name},${state.form.outputDataset.name}&norm_type=${state.form.normalization}&geojson=${encodeURIComponent(state.form.geojson)}`, {
      //   headers: {
      //     Authorization: token,
      //   },
      // })
      // .then(res => {
      //   if (!res.ok) {
      //     throw new Error(`${res.status}: ${res.statusText}`);
      //   }
      //   return res.json();
      // })
      new Promise(resolve => resolve(INPUT_OUTPUT_BANDS_MOCK))
        .then(({ data }) => dispatch({ type: 'INPUT_OUTPUT_BANDS_FETCH_SUCCESS', payload: data }))
        .catch(() => dispatch({ type: 'INPUT_OUTPUT_BANDS_FETCH_FAILURE' }));
    }
  }, [
    token,
    state.form.inputDataset,
    state.form.outputDataset,
    state.form.startDate,
    state.form.endDate,
    state.form.geojson,
    state.form.normalization,
  ]);

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

      {state.formSuccess && (
        <div className="callout success small">
          The model has been queued for training. This can take a few minutes.
        </div>
      )}

      {!boundsOverlap && (
        <div className="callout alert small">
          The input and output datasets {"don't"} intersect. Please consider changing either of
          them.
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
          options={datasetOptions}
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
          options={datasetOptions}
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
          // Trigger a re-render of the map when the input and ouput images change
          key={[state.inputImage, state.outputImage].toString()}
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
          properties={geometryMapProperties}
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
          // Trigger a re-render of the map when the input bands change
          key={
            state.inputBands && Object.keys(state.inputBands).length
              ? Object.keys(state.inputBands).toString()
              : undefined
          }
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.inputBands = c;
            }
          }}
          onChange={value => dispatch({ type: 'BANDS_INPUT_SELECT', payload: value })}
          className="-fluid"
          validations={['required']}
          options={inputBandOptions}
          hint="Select the bands of the input dataset that you want to use for the training."
          properties={{
            name: 'input-bands',
            label: 'Input bands',
            default: state.form.inputBands,
            required: true,
            multi: true,
            layers: state.inputBands
              ? Object.keys(state.inputBands).map(band => ({
                  name: band,
                  url: state.inputBands[band],
                }))
              : [],
            bounds: state.form.inputDataset ? state.form.inputDataset.bounds : undefined,
          }}
        >
          {MapSelect}
        </Field>
        <Field
          // Trigger a re-render of the map when the output bands change
          key={
            state.outputBands && Object.keys(state.outputBands).length
              ? Object.keys(state.outputBands).toString()
              : undefined
          }
          ref={c => {
            if (c) {
              FORM_ELEMENTS.elements.outputBands = c;
            }
          }}
          onChange={value => dispatch({ type: 'BANDS_OUTPUT_SELECT', payload: value })}
          className="-fluid"
          validations={['required']}
          options={outputBandOptions}
          hint="Select the bands of the output dataset that you want to use for the training."
          properties={{
            name: 'output-bands',
            label: 'Output bands',
            default: state.form.outputBands,
            required: true,
            multi: true,
            layers: state.outputBands
              ? Object.keys(state.outputBands).map(band => ({
                  name: band,
                  url: state.outputBands[band],
                }))
              : [],
            bounds: state.form.outputDataset ? state.form.outputDataset.bounds : undefined,
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
