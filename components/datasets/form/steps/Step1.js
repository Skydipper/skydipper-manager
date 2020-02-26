import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  PROVIDER_TYPES_DICTIONARY,
  FORM_ELEMENTS,
  DATASET_TYPES,
} from 'components/datasets/form/constants';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import File from 'components/form/File';
import Select from 'components/form/SelectInput';
import Checkbox from 'components/form/Checkbox';
import Modal from 'components/modal/modal-component';
import TrySubscriptionModal from 'components/datasets/form/try-subscription-modal';

const PROVIDER_OPTIONS = Object.keys(PROVIDER_TYPES_DICTIONARY).map(key => ({
  label: PROVIDER_TYPES_DICTIONARY[key].label,
  value: PROVIDER_TYPES_DICTIONARY[key].value,
}));

class Step1 extends PureComponent {
  static propTypes = {
    datasetId: PropTypes.string,
    form: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  static defaultProps = {
    datasetId: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      subscribableSelected: props.form.subscribable.length > 0,
      activeSubscriptionModal: null,
    };

    // BINDINGS
    this.onCartoFieldsChange = this.onCartoFieldsChange.bind(this);
    this.handleAddSubscription = this.handleAddSubscription.bind(this);
  }

  onCartoFieldsChange(obj) {
    const { form, onChange } = this.props;
    const { cartoAccountUsername = '', tableName = '' } = { ...form, ...obj };

    const connectorUrl = `https://${cartoAccountUsername}.carto.com/tables/${tableName}/public`;

    onChange({
      ...obj,
      connectorUrl,
    });
  }

  onLegendChange(obj) {
    const { form, onChange } = this.props;

    const legend = Object.assign({}, form.legend, obj);
    onChange({ legend });
  }

  onSubscribableChange(obj) {
    const {
      form: { subscribable },
      onChange,
    } = this.props;

    onChange({
      subscribable: subscribable.map(s => {
        if (s.id === obj.id) {
          return Object.assign({}, s, obj);
        }
        return s;
      }),
    });
  }

  onSubscribableCheckboxChange(checked) {
    const { onChange } = this.props;

    this.setState({ subscribableSelected: checked });

    if (checked) {
      onChange({ subscribable: [{ type: '', value: '', id: 0 }] });
    } else {
      onChange({ subscribable: [] });
    }
  }

  onToggleSubscribableModal(id) {
    this.setState({ activeSubscriptionModal: id });
  }

  handleRemoveSubscription(id) {
    const { onChange } = this.props;
    const {
      form: { subscribable },
    } = this.state;

    onChange({ subscribable: subscribable.filter(s => s.id !== id) });
  }

  handleAddSubscription() {
    const { onChange } = this.props;
    const {
      form: { subscribable },
    } = this.state;

    onChange({ subscribable: [...subscribable, { type: '', value: '', id: Date.now() }] });
  }

  render() {
    const { datasetId, form, onChange, user } = this.props;
    const { subscribableSelected, activeSubscriptionModal } = this.state;
    const { provider } = form;

    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    const isCarto = provider === 'cartodb';
    const isGee = provider === 'gee';
    const isNextGDDP = provider === 'nexgddp';
    const isFeatureservice = provider === 'featureservice';
    const isJson = provider === 'json';
    const isCsv = provider === 'csv';
    const isTsv = provider === 'tsv';
    const isXml = provider === 'xml';
    const isWMS = provider === 'wms';
    const isDocument = isJson || isXml || isCsv || isTsv;

    return (
      <div>
        <fieldset className="c-field-container">
          {user.role === 'ADMIN' && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.env = c;
              }}
              hint={
                'Choose "preproduction" to see this dataset it only as admin, "production" option will show it in public site.'
              }
              className="-fluid"
              options={[
                { label: 'Pre-production', value: 'preproduction' },
                { label: 'Production', value: 'production' },
              ]}
              onChange={value => onChange({ env: value })}
              properties={{
                name: 'env',
                label: 'Environment',
                placeholder: 'Type the columns...',
                noResultsText: 'Please, type the name of the columns and press enter',
                promptTextCreator: label => `The name of the column is "${label}"`,
                default: 'preproduction',
                value: form.env,
              }}
            >
              {Select}
            </Field>
          )}

          {user.role === 'ADMIN' && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.published = c;
              }}
              onChange={value => onChange({ published: value.checked })}
              validations={['required']}
              properties={{
                name: 'published',
                label: 'Do you want to set this dataset as published?',
                title: 'Published',
                default: !datasetId ? user.role === 'ADMIN' : form.published,
              }}
            >
              {Checkbox}
            </Field>
          )}

          {user.role === 'ADMIN' && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.protected = c;
              }}
              onChange={value => onChange({ protected: value.checked })}
              validations={['required']}
              properties={{
                name: 'protected',
                label: 'Do you want to set this dataset as protected?',
                title: 'Protected',
                default: form.protected,
              }}
            >
              {Checkbox}
            </Field>
          )}

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.name = c;
            }}
            onChange={value => onChange({ name: value })}
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'name',
              label: 'Title',
              type: 'text',
              required: true,
              default: form.name,
            }}
          >
            {Input}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.subtitle = c;
            }}
            onChange={value => onChange({ subtitle: value })}
            className="-fluid"
            properties={{
              name: 'subtitle',
              label: 'Subtitle',
              type: 'text',
              default: form.subtitle,
            }}
          >
            {Input}
          </Field>

          {user.role === 'ADMIN' && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.type = c;
              }}
              onChange={value => {
                onChange({
                  type: value,
                  ...(value === 'raster' && { geoInfo: true }),
                });
              }}
              className="-fluid"
              validations={['required']}
              options={DATASET_TYPES}
              hint={`
                <ul>
                  <li>Tabular: Dataset contains table formatted data. Providers available: Carto, Gee, Feature Service, csv, json tsv and xml</li>
                  <li>Raster: Dataset is an image. Only Google Earth Engine, wms and Carto connectors can hold raster data</li>
                </ul>
              `}
              properties={{
                name: 'type',
                label: 'Type',
                default: form.type,
                value: form.type,
                disabled: !!datasetId,
                required: true,
                instanceId: 'selectType',
              }}
            >
              {Select}
            </Field>
          )}

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.geoInfo = c;
            }}
            onChange={value => onChange({ geoInfo: value.checked })}
            validations={['required']}
            properties={{
              name: 'geoInfo',
              label:
                'Does this dataset contain geographical features such as points, polygons or lines?',
              title: 'Yes',
              disabled: form.type === 'raster',
              default: form.geoInfo,
            }}
          >
            {Checkbox}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.provider = c;
            }}
            onChange={value => {
              onChange({
                provider: value,
                connectorUrl: '',
                legend: {
                  lat: undefined,
                  long: undefined,
                  date: [],
                  country: [],
                },
                connectorType: PROVIDER_TYPES_DICTIONARY[value]
                  ? PROVIDER_TYPES_DICTIONARY[value].connectorType
                  : null,
              });
            }}
            className="-fluid"
            validations={['required']}
            options={PROVIDER_OPTIONS}
            properties={{
              name: 'provider',
              label: 'Provider',
              default: form.provider,
              value: form.provider,
              disabled: !!datasetId,
              required: true,
              instanceId: 'selectProvider',
            }}
          >
            {Select}
          </Field>

          {/*
           *****************************************************
           ****************** CARTODB FIELDS * ***************
           *****************************************************
           */}
          {isCarto && !datasetId && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.cartoAccountUsername = c;
              }}
              onChange={value => this.onCartoFieldsChange({ cartoAccountUsername: value })}
              validations={['required']}
              className="-fluid"
              properties={{
                name: 'cartoAccountUsername',
                label: 'Carto account username',
                type: 'text',
                default: form.cartoAccountUsername,
                required: true,
              }}
            >
              {Input}
            </Field>
          )}

          {isCarto && !datasetId && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.tableName = c;
              }}
              onChange={value => this.onCartoFieldsChange({ tableName: value })}
              validations={['required']}
              className="-fluid"
              properties={{
                name: 'tableName',
                label: 'Table name',
                type: 'text',
                default: form.tableName,
                required: true,
              }}
            >
              {Input}
            </Field>
          )}

          {isCarto && !!datasetId && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.connectorUrl = c;
              }}
              validations={['required']}
              className="-fluid"
              properties={{
                name: 'connectorUrl',
                label: 'connector Url',
                type: 'text',
                default: form.connectorUrl,
                disabled: !!datasetId,
                required: true,
              }}
            >
              {Input}
            </Field>
          )}

          {/*
           *****************************************************
           ****************** GEE FIELDS * ***************
           *****************************************************
           */}
          {isGee && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.tableName = c;
              }}
              onChange={value => onChange({ tableName: value })}
              validations={['required']}
              className="-fluid"
              hint="Please add fusion table (ft:id) or an image. Example: projects/wri-datalab/HansenComposite_14-15`"
              properties={{
                name: 'tableName',
                label: 'Asset id',
                type: 'text',
                default: form.tableName,
                disabled: !!datasetId,
                required: true,
              }}
            >
              {Input}
            </Field>
          )}

          {/*
           *****************************************************
           ****************** NEXTGDDP FIELDS * ***************
           *****************************************************
           */}
          {isNextGDDP && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.tableName = c;
              }}
              onChange={value => onChange({ tableName: value })}
              validations={['required']}
              className="-fluid"
              hint="Please verify that the scenario and model is already incorporated in Rasdaman. Example: scenario/model"
              properties={{
                name: 'tableName',
                label: 'Table name',
                type: 'text',
                default: form.tableName,
                disabled: !!datasetId,
                required: true,
              }}
            >
              {Input}
            </Field>
          )}

          {/*
           *****************************************************
           ****************** FEATURE SERVICE ****************
           *****************************************************
           */}
          {isFeatureservice && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.connectorUrl = c;
              }}
              onChange={value => onChange({ connectorUrl: value })}
              validations={['required', 'url']}
              className="-fluid"
              hint="Example: http://gis-gfw.wri.org/arcgis/rest/services/prep/nex_gddp_indicators/MapServer/6?f=pjson"
              properties={{
                name: 'connectorUrl',
                label: 'Url data endpoint',
                type: 'text',
                default: form.connectorUrl,
                disabled: !!datasetId,
                required: true,
              }}
            >
              {Input}
            </Field>
          )}

          {/*
           *****************************************************
           ****************** WMS ****************
           *****************************************************
           */}
          {isWMS && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.connectorUrl = c;
              }}
              onChange={value => onChange({ connectorUrl: value })}
              validations={['required', 'url']}
              className="-fluid"
              hint="This connector will only display the data as a wms map layer. The data will not be available through queries."
              properties={{
                name: 'connectorUrl',
                label: 'Url data endpoint',
                type: 'text',
                default: form.connectorUrl,
                disabled: !!datasetId,
                required: true,
              }}
            >
              {Input}
            </Field>
          )}

          {/*
           *****************************************************
           ****************** SUBSCRIBABLE ****************
           *****************************************************
           */}

          {user.role === 'ADMIN' && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.subscribable = c;
              }}
              onChange={value => this.onSubscribableCheckboxChange(value.checked)}
              properties={{
                name: 'subscribable',
                title: 'Subscribable',
                default: form.subscribable.length > 0,
              }}
            >
              {Checkbox}
            </Field>
          )}

          {subscribableSelected && form.subscribable.length && (
            <h3>Subscriptions ({form.subscribable.length})</h3>
          )}

          {subscribableSelected && (
            <div>
              {form.subscribable.map(elem => (
                <div className="c-field-row subscription-container" key={elem.id}>
                  <div className="l-row row">
                    <div className="column small-12">
                      <Field
                        ref={c => {
                          if (c) FORM_ELEMENTS.elements.subscribableType = c;
                        }}
                        onChange={type =>
                          this.onSubscribableChange({
                            type,
                            id: elem.id,
                          })
                        }
                        validations={[
                          'required',
                          {
                            type: 'unique',
                            value: elem.type,
                            default: elem.type,
                            condition: 'type',
                            data: form.subscribable,
                          },
                        ]}
                        className="-fluid"
                        properties={{
                          name: 'subscribableType',
                          label: 'Type',
                          type: 'text',
                          default: elem.type,
                          required: true,
                        }}
                      >
                        {Input}
                      </Field>
                    </div>

                    <div className="column small-12">
                      <Field
                        ref={c => {
                          if (c) FORM_ELEMENTS.elements.dataQuery = c;
                        }}
                        onChange={dataQuery =>
                          this.onSubscribableChange({ dataQuery, id: elem.id })
                        }
                        validations={['required']}
                        className="-fluid"
                        button={(
<button
  type="button"
  className="c-button -secondary"
  onClick={() => this.onToggleSubscribableModal(elem.id)}
>
                            Try it
</button>
)}
                        properties={{
                          name: 'dataQuery',
                          label: 'Data query',
                          type: 'text',
                          default: elem.dataQuery,
                          required: true,
                        }}
                      >
                        {Input}
                      </Field>

                      {activeSubscriptionModal === elem.id && (
                        <Modal isOpen onRequestClose={() => this.onToggleSubscribableModal(null)}>
                          <TrySubscriptionModal query={elem.dataQuery} />
                        </Modal>
                      )}
                    </div>

                    <div className="column small-12">
                      <Field
                        ref={c => {
                          if (c) FORM_ELEMENTS.elements.subscriptionQuery = c;
                        }}
                        onChange={subscriptionQuery =>
                          this.onSubscribableChange({ subscriptionQuery, id: elem.id })
                        }
                        validations={['required']}
                        className="-fluid"
                        button={(
<button
  type="button"
  className="c-button -secondary"
  onClick={() => this.onToggleSubscribableModal(elem.id)}
>
                            Try it
</button>
)}
                        properties={{
                          name: 'subscriptionQuery',
                          label: 'Subscription query',
                          type: 'text',
                          default: elem.subscriptionQuery,
                          required: true,
                        }}
                      >
                        {Input}
                      </Field>

                      {activeSubscriptionModal === elem.id && (
                        <Modal isOpen onRequestClose={() => this.onToggleSubscribableModal(null)}>
                          <TrySubscriptionModal query={elem.subscriptionQuery} />
                        </Modal>
                      )}
                    </div>

                    <div className="column small-12 remove-subscribable-container">
                      <button
                        type="button"
                        className="c-button -secondary"
                        onClick={() => this.handleRemoveSubscription(elem.id)}
                        disabled={form.subscribable.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="c-field-row">
                <div className="l-row row">
                  <div className="column small-12 add-subscribable-container">
                    <button
                      type="button"
                      className="c-button -secondary -fullwidth"
                      onClick={this.handleAddSubscription}
                    >
                      Add subscription
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*
           *****************************************************
           ****************** DOCUMENT ****************
           *****************************************************
           */}

          {isDocument && user.role === 'ADMIN' && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.verified = c;
              }}
              onChange={value => onChange({ verified: value.checked })}
              validations={['required']}
              properties={{
                name: 'verified',
                label: 'Is this dataset verified?',
                title: 'Verified',
                default: form.verified,
              }}
            >
              {Checkbox}
            </Field>
          )}

          {isDocument && !datasetId && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.connectorUrl = c;
              }}
              onChange={({ value }) => {
                onChange({
                  connectorUrl: value,
                });
              }}
              validations={['required', 'url']}
              className="-fluid"
              properties={{
                name: 'connectorUrl',
                label: 'Url data endpoint / File',
                type: 'text',
                placeholder: 'Paste a URL here or browse file',
                authorization: form.authorization,
                provider: form.provider,
                default: form.connectorUrl,
                disabled: !!datasetId,
                required: true,
              }}
            >
              {File}
            </Field>
          )}

          {isDocument && !!datasetId && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.connectorUrl = c;
              }}
              onChange={value => {
                onChange({ connectorUrl: value });
              }}
              validations={['required', 'url']}
              className="-fluid"
              properties={{
                name: 'connectorUrl',
                label: 'Url data endpoint / File',
                type: 'text',
                default: form.connectorUrl,
                disabled: !!datasetId,
                required: true,
              }}
            >
              {Input}
            </Field>
          )}

          {(isJson || isXml) && (
            <Field
              ref={c => {
                if (c) FORM_ELEMENTS.elements.dataPath = c;
              }}
              onChange={value => onChange({ dataPath: value })}
              hint="Name of the element that you want to import"
              validations={isXml ? ['required'] : []}
              className="-fluid"
              properties={{
                name: 'dataPath',
                label: 'Data path',
                type: 'text',
                default: form.dataPath,
                disabled: !!datasetId,
                required: isXml,
              }}
            >
              {Input}
            </Field>
          )}
        </fieldset>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Step1);
