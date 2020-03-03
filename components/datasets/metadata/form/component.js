import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

import { Router } from 'routes';
import DatasetsService from 'services/DatasetsService';
import { FORM_DEFAULT_STATE, FORM_ELEMENTS } from 'components/datasets/metadata/form/constants';
import Spinner from 'components/ui/Spinner';
import Navigation from 'components/form/Navigation';
import Step1 from 'components/datasets/metadata/form/steps/Step1';

const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: false };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        form: {
          ...state.form,
          ...action.payload.form,
        },
        metadata: action.payload.metadata,
        dataset: action.payload.dataset,
      };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: true };
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
    default:
      return state;
  }
};

const MetadataForm = ({ datasetId, token, locale, userApplications, setSources, resetSources }) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [state, dispatch] = useReducer(fetchReducer, {
    loading: false,
    error: false,
    dataset: {},
    metadata: [],
    form: { ...FORM_DEFAULT_STATE, application: userApplications.join(',') },
    formLoading: false,
    formInvalid: false,
    formSuccess: false,
    formError: false,
  });

  const [step, setStep] = useState(1);
  const [stepsCount] = useState(1);

  const onSubmit = e => {
    e.preventDefault();

    // Validate the form
    const valid = FORM_ELEMENTS.validate();

    if (!valid) {
      dispatch({ type: 'FORM_INVALID' });
    } else if (step !== stepsCount) {
      dispatch({ type: 'FORM_VALID' });
      setStep(s => s + 1);
    } else {
      dispatch({ type: 'FORM_SUBMIT_INIT' });

      const thereIsMetadata = state.metadata.some(metadata => {
        const hasLang = metadata.attributes.language === state.form.language;
        const hasApp = metadata.attributes.application === state.form.application;

        return hasLang && hasApp;
      });

      const requestOptions = {
        type: datasetId && thereIsMetadata ? 'PATCH' : 'POST',
        omit: ['authorization'],
      };

      const service = new DatasetsService({
        authorization: token,
        language: locale,
      });

      service
        .saveMetadata({
          type: requestOptions.type,
          id: datasetId,
          body: omit(state.form, requestOptions.omit),
        })
        .then(() => {
          dispatch({ type: 'FORM_SUBMIT_SUCCESS' });
          Router.pushRoute('manager_data', { tab: 'datasets', id: datasetId });
        })
        .catch(() => dispatch({ type: 'FORM_SUBMIT_FAILURE' }));
    }
  };

  const onChange = newForm => dispatch({ type: 'FORM_UPDATE', payload: newForm });

  const onStepChange = newStep => setStep(newStep);

  useEffect(() => {
    if (datasetId) {
      const service = new DatasetsService({
        authorization: token,
        language: locale,
      });

      dispatch({ type: 'FETCH_INIT' });

      const data = {};
      service
        .fetchData({ id: datasetId, includes: 'metadata' })
        .then(dataset => {
          const { metadata } = dataset;
          data.dataset = dataset;
          data.metadata = metadata;
          data.form = metadata.length ? metadata[0].attributes : {};

          setSources(metadata.length ? metadata[0].attributes.info.sources || [] : []);

          dispatch({
            type: 'FETCH_SUCCESS',
            payload: data,
          });
        })
        .catch(() => {
          resetSources();
          dispatch({ type: 'FETCH_FAILURE' });
        });
    } else {
      resetSources();
    }
  }, [datasetId, locale, resetSources, setSources, token]);

  return (
    <form className="c-form c-metadata-form" onSubmit={onSubmit} noValidate>
      <Spinner isLoading={state.loading || state.formLoading} className="-light" />

      {state.error && <div className="callout alert small">Unable to load the metadata</div>}

      {state.formError && <div className="callout alert small">Unable to save the form</div>}

      {state.formInvalid && (
        <div className="callout alert small">
          Fill all the required fields or correct the invalid values
        </div>
      )}

      {!state.error && !state.loading && step === 1 && (
        <Step1 form={state.form} onChange={onChange} />
      )}

      {!state.error && !state.loading && (
        <Navigation
          step={step}
          stepLength={stepsCount}
          submitting={state.formLoading}
          onStepChange={onStepChange}
        />
      )}
    </form>
  );
};

MetadataForm.propTypes = {
  datasetId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  userApplications: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSources: PropTypes.func.isRequired,
  resetSources: PropTypes.func.isRequired,
};

export default MetadataForm;
