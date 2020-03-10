import React, { useEffect, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';

import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';
import Spinner from 'components/ui/Spinner';

import './style.scss';

const reducer = (state, action) => {
  switch (action.type) {
    case 'MODELS_FETCH_INIT':
      return { ...state, loading: true, error: false };
    case 'MODELS_FETCH_SUCCESS': {
      const models = action.payload
        .filter(
          (model, i) => action.payload.findIndex(m => m.model_name === model.model_name) !== i
        )
        .map(model => ({
          ...model,
          versions: action.payload
            .filter(m => m.model_name === model.model_name)
            .map(m => m.version),
          validationUrlByVersion: action.payload
            .filter(m => m.model_name === model.model_name)
            .reduce((res, m) => ({ ...res, [m.version]: m.tb_url }), {}),
        }));
      return { ...state, loading: false, error: false, models };
    }
    case 'MODELS_FETCH_FAILURE':
      return { ...state, loading: false, error: true };
    case 'MODELS_SELECT':
      return { ...state, model: state.models.find(m => m.model_name === action.payload) };
    case 'VERSIONS_SELECT':
      return { ...state, version: action.payload };
    default:
      return state;
  }
};

const MLValidation = ({ token }) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: false,
    models: [],
    model: null,
    version: null,
  });

  const modelOptions = useMemo(
    () =>
      state.models
        .map(model => ({ label: model.model_name, value: model.model_name }))
        .sort((m1, m2) => m1.label.localeCompare(m2.label)),
    [state.models]
  );

  const versionOptions = useMemo(() => {
    if (!state.model) {
      return [];
    }

    const options = state.model.versions
      .map(version => ({ label: version, value: version }))
      .reverse();

    return [{ label: `Latest (${options[0].label})`, value: 'last' }, ...options];
  }, [state.model]);

  const validationUrl = useMemo(() => {
    if (!state.model || !state.version) {
      return null;
    }

    const version = state.version === 'last' ? Math.max(...state.model.versions) : state.version;

    return state.model.validationUrlByVersion[version];
  }, [state.model, state.version]);

  useEffect(() => {
    dispatch({ type: 'MODELS_FETCH_INIT' });
    fetch(`${process.env.WRI_API_URL}/geopredictor/model`, {
      headers: {
        Authorization: token,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(({ data }) => dispatch({ type: 'MODELS_FETCH_SUCCESS', payload: data }))
      .catch(() => dispatch({ type: 'MODELS_FETCH_FAILURE' }));
  }, [token]);

  return (
    <div className="c-ml-validation">
      <Spinner isLoading={state.loading || state.formLoading} className="-light" />

      {state.error && <div className="callout alert small">Unable to load the data</div>}

      <div className="actions-bar">
        <div>
          <Field
            options={modelOptions}
            onChange={modelName => dispatch({ type: 'MODELS_SELECT', payload: modelName })}
            properties={{
              name: 'model',
              label: 'Model',
              placeholder: 'Select a model',
            }}
          >
            {Select}
          </Field>
        </div>
        <div>
          <Field
            options={versionOptions}
            onChange={version => dispatch({ type: 'VERSIONS_SELECT', payload: version })}
            properties={{
              name: 'version',
              label: 'Version',
              placeholder: 'Select a version',
            }}
          >
            {Select}
          </Field>
        </div>
      </div>
      <div className="visualization">
        {validationUrl && <iframe src={validationUrl} title="TensorBoard of the model" />}
      </div>
    </div>
  );
};

MLValidation.propTypes = {
  token: PropTypes.string.isRequired,
};

export default MLValidation;
