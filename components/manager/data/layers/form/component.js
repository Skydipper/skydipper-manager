import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Router } from 'routes';
import LayerManager from 'utils/layers/LayerManager';
import DatasetsService from 'services/DatasetsService';
import LayersService, { fetchLayer } from 'services/LayersService';
import Step1 from 'components/manager/data/layers/form/steps/Step1';
import Navigation from 'components/form/Navigation';
import Spinner from 'components/ui/Spinner';
import { FORM_DEFAULT_STATE, FORM_ELEMENTS } from './constants';

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
        datasets: action.payload.datasets || [],
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

const LayersForm = ({
  layerId,
  datasetId,
  token,
  locale,
  userApplications,
  managerLayerPreview,
  setLayerInteractionError,
}) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [state, dispatch] = useReducer(fetchReducer, {
    loading: false,
    error: false,
    datasets: [],
    form: { ...FORM_DEFAULT_STATE, application: userApplications, id: layerId, dataset: datasetId },
    formLoading: false,
    formInvalid: false,
    formSuccess: false,
    formError: false,
  });

  const [step, setStep] = useState(1);
  const [stepsCount] = useState(1);

  const layerManager = new LayerManager(null, {
    layersUpdated: (valid, err) => {
      setLayerInteractionError(valid ? false : err);
    },
  });

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
      const form = Object.assign({}, state.form);

      // Verify that layers are valid, otherwise render error
      const { layerGroups } = managerLayerPreview;
      const cartoLayer =
        layerGroups.length && 'layers' in layerGroups[0]
          ? layerGroups[0].layers.filter(layer => layer.provider === 'cartodb')
          : [];

      // Start the submitting
      setLayerInteractionError(false);

      let layerValid = true;
      if (cartoLayer.length) {
        // If we have carto layers, make sure they work
        layerManager.verifyCartoLayer(
          Object.assign({}, cartoLayer[0], { layerConfig: form.layerConfig }),
          cartoLayerValid => {
            if (!cartoLayerValid) {
              layerValid = false;
            }
          }
        );
      }

      if (cartoLayer.length && !layerValid) {
        dispatch({ type: 'FORM_INVALID' });
      } else {
        dispatch({ type: 'FORM_SUBMIT_INIT' });

        const { id, dataset } = form;
        const service = new LayersService({
          authorization: token,
          language: locale,
        });

        service
          .saveData({
            dataset,
            id: id || '',
            type: id ? 'PATCH' : 'POST',
            body: form,
          })
          .then(() => {
            dispatch({ type: 'FORM_SUBMIT_SUCCESS' });

            if (datasetId) {
              Router.pushRoute('manager_data_detail', {
                tab: 'datasets',
                subtab: 'layers',
                id: datasetId,
              });
            } else {
              Router.pushRoute('manager_data', { tab: 'layers' });
            }
          })
          .catch(() => dispatch({ type: 'FORM_SUBMIT_FAILURE' }));
      }
    }
  };

  const onChange = newForm => dispatch({ type: 'FORM_UPDATE', payload: newForm });

  const onStepChange = newStep => setStep(newStep);

  const onVerifyLayerConfig = () => {
    const { layerGroups } = managerLayerPreview;

    const cartoLayer =
      layerGroups.length && 'layers' in layerGroups[0]
        ? layerGroups[0].layers.filter(layer => layer.provider === 'cartodb')
        : [];

    if (cartoLayer.length) {
      // If we have carto layers, make sure they work
      layerManager.verifyCartoLayer(
        Object.assign({}, cartoLayer[0], { layerConfig: state.form.layerConfig })
      );
    }
  };

  useEffect(() => {
    const datasetsService = new DatasetsService({
      authorization: token,
      language: locale,
    });

    dispatch({ type: 'FETCH_INIT' });

    const data = {};
    new Promise((resolve, reject) => {
      if (layerId) {
        resolve();
        return;
      }

      datasetsService
        .fetchAllData({})
        .then(datasets => {
          data.datasets = datasets;
          resolve();
        })
        .catch(reject);
    })
      .then(() => {
        if (layerId) {
          return fetchLayer(layerId, token).then(layer => {
            data.form = Object.keys(layer).reduce((res, key) => {
              if (typeof layer[key] !== 'undefined' || layer[key] !== null) {
                return { ...res, [key]: layer[key] };
              }
              return res;
            }, {});
          });
        }
        return Promise.resolve();
      })
      .then(() => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(() => dispatch({ type: 'FETCH_FAILURE' }));
  }, [layerId, locale, token]);

  return (
    <form className="c-form c-layers-form" onSubmit={onSubmit} noValidate>
      <Spinner isLoading={state.loading || state.formLoading} className="-light" />

      {state.error && <div className="callout alert small">Unable to load the data</div>}

      {state.formError && <div className="callout alert small">Unable to save the form</div>}

      {state.formInvalid && (
        <div className="callout alert small">
          Fill all the required fields or correct the invalid values
        </div>
      )}

      {!state.error && !state.loading && step === 1 && (
        <Step1
          form={state.form}
          datasets={state.datasets}
          layerPreview={managerLayerPreview}
          onChange={onChange}
          onVerifyLayerConfig={onVerifyLayerConfig}
        />
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

LayersForm.propTypes = {
  layerId: PropTypes.string,
  datasetId: PropTypes.string,
  token: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  userApplications: PropTypes.arrayOf(PropTypes.string).isRequired,
  managerLayerPreview: PropTypes.object.isRequired,
  setLayerInteractionError: PropTypes.func.isRequired,
};

LayersForm.defaultProps = {
  layerId: null,
  datasetId: null,
};

export default LayersForm;
