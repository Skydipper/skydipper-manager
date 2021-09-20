import React, { useState, useEffect, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';

import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';
import DatePicker from 'components/form/DatePicker';
import Spinner from 'components/ui/Spinner';

import './style.scss';

const reducer = (state, action) => {
  switch (action.type) {
    case 'MODELS_FETCH_INIT':
      return { ...state, loading: true, error: false };
    case 'MODELS_FETCH_SUCCESS': {
      const models = action.payload
        .filter(
          (model, i) => action.payload.findIndex(m => m.model_name === model.model_name) === i
        )
        .map(model => ({
          ...model,
          versions: action.payload
            .filter(m => m.model_name === model.model_name)
            .map(m => m.version),
        }));
      return { ...state, loading: false, error: false, models };
    }
    case 'MODELS_FETCH_FAILURE':
      return { ...state, loading: false, error: true };
    case 'MODELS_SELECT':
      return { ...state, model: state.models.find(m => m.model_name === action.payload) };
    case 'VERSIONS_SELECT':
      return { ...state, version: action.payload };
    case 'DRAWING_SET_STATE':
      return {
        ...state,
        drawingState: action.payload.state,
        geojson: action.payload.geojson || state.geojson,
      };
    case 'PREDICTIONS_FETCH_INIT':
      return { ...state, loading: true, error: false };
    case 'PREDICTIONS_FETCH_SUCCESS': {
      return {
        ...state,
        loading: false,
        error: false,
        prediction: action.payload,
      };
    }
    case 'PREDICTIONS_FETCH_FAILURE':
      return { ...state, loading: false, error: true };
    case 'START_DATE_SELECT':
      return { ...state, startDate: action.payload };
    case 'END_DATE_SELECT':
      return { ...state, endDate: action.payload };
    default:
      return state;
  }
};

const MLPredictions = ({ token }) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: false,
    models: [],
    model: null,
    version: null,
    drawingState: 'idle',
    geojson: null,
    startDate: null,
    endDate: null,
    prediction: null,
  });

  const [leafletMap, setLeafletMap] = useState(null);
  const [polygon, setPolygon] = useState(null);

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

  const onClickDraw = () => {
    if (leafletMap) {
      if (state.drawingState === 'idle') {
        dispatch({ type: 'DRAWING_SET_STATE', payload: { state: 'drawing' } });
        setPolygon(leafletMap.editTools.startPolygon());
      } else if (state.drawingState === 'drawing') {
        dispatch({
          type: 'DRAWING_SET_STATE',
          payload: { state: 'finished', geojson: polygon.toGeoJSON() },
        });
        leafletMap.editTools.stopDrawing();
        polygon.editor.disable();
      } else {
        dispatch({ type: 'DRAWING_SET_STATE', payload: { state: 'drawing' } });
        polygon.remove();
        setPolygon(leafletMap.editTools.startPolygon());
      }
    }
  };

  useEffect(() => {
    const map = L.map('ml-predictions-map', { editable: true }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
    }).addTo(map);

    setLeafletMap(map);

    return () => map.remove();
  }, []);

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

  useEffect(() => {
    if (state.model && state.version && state.geojson && state.startDate && state.endDate) {
      dispatch({ type: 'PREDICTIONS_FETCH_INIT' });
      fetch(
        `${process.env.WRI_API_URL}/geopredictor/model/${state.model.model_name}?model_version=${
          state.version
        }&geojson=${JSON.stringify(state.geojson)}&init_date=${state.startDate}&end_date=${
          state.endDate
        }`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
        .then(res => {
          if (!res.ok) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then(({ data }) => dispatch({ type: 'PREDICTIONS_FETCH_SUCCESS', payload: data }))
        .catch(() => dispatch({ type: 'PREDICTIONS_FETCH_FAILURE' }));
    }
  }, [token, state.model, state.version, state.geojson, state.startDate, state.endDate]);

  useEffect(() => {
    let inLayer;
    let outLayers = [];
    let control;
    if (leafletMap && state.prediction) {
      inLayer = L.tileLayer(state.prediction.inputImage[0], { minZoom: 6 }).addTo(leafletMap);
      outLayers = state.prediction.outputImage.map(url =>
        L.tileLayer(url, { minZoom: 6 }).addTo(leafletMap)
      );

      // leafletMap.setView(state.prediction.centroid, 6);
      const layersName = ["cropland", "land", "water", "urban"];
      const layer = {
        'Input layer': inLayer,
        ...(outLayers.length === 1
          ? {
              'Turbidity blended mean': outLayers[0],
            }
          : outLayers.reduce(
              (res, layer, index) => ({ ...res, [`${layersName[index]}`]: layer }),
              {}
            )),
      };

      control = L.control.layers(null, layer, { collapsed: false }).addTo(leafletMap);
    }

    return () => {
      if (inLayer && outLayers.length) {
        leafletMap.removeLayer(inLayer);
        outLayers.forEach(layer => leafletMap.removeLayer(layer));
        leafletMap.removeControl(control);
      }
    };
  }, [leafletMap, state.prediction]);

  return (
    <div className="c-ml-predictions">
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
        <div className="dates">
          <div>
            <div className="label">Dates</div>
            <Field
              onChange={date => dispatch({ type: 'START_DATE_SELECT', payload: date })}
              properties={{
                name: 'startDate',
                'aria-label': 'Start date',
                placeholder: 'Start date',
                before: state.endDate,
              }}
            >
              {DatePicker}
            </Field>
            <Field
              onChange={date => dispatch({ type: 'END_DATE_SELECT', payload: date })}
              properties={{
                name: 'endDate',
                'aria-label': 'End date',
                placeholder: 'End date',
                after: state.startDate,
              }}
            >
              {DatePicker}
            </Field>
          </div>
        </div>
        <div>
          <div>
            <div className="label">Area</div>
            <button type="button" className="c-button -secondary" onClick={onClickDraw}>
              {state.drawingState === 'idle' && 'Draw an area'}
              {state.drawingState === 'drawing' && 'Stop drawing'}
              {state.drawingState === 'finished' && 'Draw new area'}
            </button>
          </div>
        </div>
      </div>
      <div className="visualization">
        <div id="ml-predictions-map" />
        {!!state.prediction && (
          <div className="legend">
            <p>{state.model.model_name}</p>
            <div className="scale">
              <span>0</span>
              <span>1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

MLPredictions.propTypes = {
  token: PropTypes.string.isRequired,
};

export default MLPredictions;
