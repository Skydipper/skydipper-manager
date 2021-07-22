import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import FormElement from 'components/form/FormElement';

import './style.scss';

class MapSelect extends FormElement {
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

    this.map = L.map(this.mapEl).setView([20, 0], 2);

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

  triggerChange(geojson) {
    const { onChange } = this.props;

    this.setState({ value: geojson });
    this.triggerValidate();
    if (onChange) onChange(geojson);
  }

  render() {
    const { options, properties } = this.props;

    return (
      <div className="c-map-select">
        <div className="actions-bar">
          <Select
            {...properties}
            options={options}
            id={`select-${properties.name}`}
            value={this.state.value}
            onChange={this.triggerChange}
          />
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

export default MapSelect;
