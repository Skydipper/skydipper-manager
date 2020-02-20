import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

// Service
import { Router } from 'routes';
import DatasetsService from 'services/DatasetsService';
import { FORM_DEFAULT_STATE, FORM_ELEMENTS } from 'components/datasets/form/constants';
import Navigation from 'components/form/Navigation';
import Step1 from 'components/datasets/form/steps/Step1';
import Spinner from 'components/ui/Spinner';

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
          ...action.payload,
          subscribable: action.payload.subscribable
            ? Object.keys(action.payload.subscribable).map((key, i) => ({
                id: i,
                type: key,
                dataQuery: action.payload.subscribable[key].dataQuery,
                subscriptionQuery: action.payload.subscribable[key].subscriptionQuery,
              }))
            : undefined,
        },
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

const DatasetsForm = ({ datasetId, token, locale, userApplications }) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [state, dispatch] = useReducer(fetchReducer, {
    loading: false,
    error: false,
    form: { ...FORM_DEFAULT_STATE, application: userApplications },
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

      // Set the request
      const requestOptions = {
        type: datasetId ? 'PATCH' : 'POST',
        omit: datasetId
          ? ['connectorUrlHint', 'authorization', 'connectorType', 'provider']
          : ['connectorUrlHint', 'authorization'],
      };

      /** @type {any} body */
      const body = omit(state.form, requestOptions.omit);
      body.subscribable = state.form.subscribable.reduce(
        (res, obj) => ({
          ...res,
          [obj.type]: { dataQuery: obj.dataQuery, subscriptionQuery: obj.subscriptionQuery },
        }),
        {}
      );

      const service = new DatasetsService({
        authorization: token,
        language: locale,
      });

      service
        .saveData({ id: datasetId, type: requestOptions.type, body })
        .then(() => {
          dispatch({ type: 'FORM_SUBMIT_SUCCESS' });
          Router.pushRoute('manager_data', { tab: 'datasets' });
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

      service
        .fetchData({ id: datasetId })
        .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
        .catch(() => dispatch({ type: 'FETCH_FAILURE' }));
    }
  }, [datasetId, locale, token]);

  return (
    <form className="c-form c-datasets-form" onSubmit={onSubmit} noValidate>
      <Spinner isLoading={state.loading || state.formLoading} className="-light" />

      {state.error && <div className="callout alert small">Unable to load the dataset</div>}

      {state.formError && <div className="callout alert small">Unable to save the form</div>}

      {state.formInvalid && (
        <div className="callout alert small">
          Fill all the required fields or correct the invalid values
        </div>
      )}

      {!state.error && !state.loading && step === 1 && (
        <Step1 datasetId={datasetId} form={state.form} onChange={onChange} />
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

DatasetsForm.propTypes = {
  datasetId: PropTypes.string,
  token: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  userApplications: PropTypes.arrayOf(PropTypes.string).isRequired,
};

DatasetsForm.defaultProps = {
  datasetId: null,
};

export default DatasetsForm;
