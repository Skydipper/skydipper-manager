import React from 'react';
import PropTypes from 'prop-types';

import FormElement from 'components/form/FormElement';

import './style.scss';

class MapInput extends FormElement {
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
      value: null,
    };
  }

  componentDidMount() {
    const { properties } = this.props;
    const { value } = this.state;

    if (value && value.length) {
      this.triggerValidate();
    }

    this.map = L.map(this.mapEl, { editable: true }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
    }).addTo(this.map);

    if (properties.layers && properties.layers.length) {
      const layers = properties.layers.map(layer =>
        L.tileLayer(layer.url, { minZoom: 6 }).addTo(this.map)
      );

      // TODO: setView should be based on layers
      // this.map.setView([20, 0], 6);

      const layerControl = properties.layers.reduce(
        (res, layer, i) => ({ ...res, [layer.name]: layers[i] }),
        {}
      );

      L.control.layers(null, layerControl, { collapsed: false }).addTo(this.map);
    }

    if (properties.bounds) {
      this.map.fitBounds(properties.bounds);
    }

    this.map.on('editable:drawing:commit', () => this.onChangePolygon('finish'));
    this.map.on('editable:vertex:dragend', () => this.onChangePolygon('edit'));
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.properties.bounds !== this.props.properties.bounds &&
      nextProps.properties.bounds
    ) {
      this.map.fitBounds(nextProps.properties.bounds);
    }

    return true;
  }

  componentWillUnmount() {
    try {
      this.map.remove();
    } catch (e) {
      // FIXME: Leaflet bug
      // https://github.com/Leaflet/Leaflet/issues/6486
    }
  }

  onClickAddPolygon() {
    if (!this.polygon) {
      this.disableNewShape = true;
      this.polygon = this.map.editTools.startPolygon();
    } else if (!this.disableNewShape) {
      this.disableNewShape = true;
      this.polygon.editor.newShape();
    }
  }

  onClickReset() {
    if (this.polygon) {
      this.triggerChange(null);
      this.polygon.remove();
      this.polygon = null;
      this.disableNewShape = false;
      this.onClickAddPolygon();
    }
  }

  onChangePolygon(action) {
    if (this.polygon) {
      this.triggerChange(this.polygon.toGeoJSON());
    }

    if (action === 'finish') {
      this.disableNewShape = false;
    }
  }

  triggerChange(geojson) {
    const { onChange } = this.props;

    this.setState({ value: geojson });
    this.triggerValidate();
    if (onChange) onChange(geojson);
  }

  render() {
    return (
      <div className="c-map-input">
        <div className="actions-bar">
          <button type="button" className="c-button -secondary" onClick={() => this.onClickReset()}>
            Reset
          </button>
          <button
            type="button"
            className="c-button -primary"
            onClick={() => this.onClickAddPolygon()}
          >
            Add polygon
          </button>
        </div>
        <div
          className="map"
          ref={node => {
            this.mapEl = node;
          }}
        />
      </div>
    );
  }
}

export default MapInput;
