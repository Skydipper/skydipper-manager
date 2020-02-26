import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { PROVIDER_OPTIONS, FORM_ELEMENTS } from 'components/manager/data/layers/form/constants';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import Textarea from 'components/form/TextArea';
import Checkbox from 'components/form/Checkbox';
import Code from 'components/form/Code';
import LayerPreviewComponent from '../layer-preview';

class Step1 extends PureComponent {
  layerConfigStatus(title, err) {
    const classes = classnames({
      'layer-config-status': true,
      errors: !!err,
    });

    return (
      <section className={classes}>
        <h4>{title}</h4>
        {err && err.errors && (
          <ul>
            {err.errors.map((e, k) => (
              <li key={k}>{e}</li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  render() {
    const { form, datasets, onChange, user, layerPreview, onVerifyLayerConfig } = this.props;

    return (
      <fieldset className="c-field-container">
        {!form.id && (
          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.dataset = c;
            }}
            onChange={value => onChange({ dataset: value })}
            validations={['required']}
            options={datasets.map(d => ({ label: d.name, value: d.id }))}
            properties={{
              name: 'dataset',
              label: 'Dataset',
              type: 'text',
              required: true,
              default: form.dataset,
            }}
          >
            {Select}
          </Field>
        )}

        <Field
          ref={c => {
            if (c) FORM_ELEMENTS.elements.name = c;
          }}
          onChange={value => onChange({ name: value })}
          validations={['required']}
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

        {/* PUBLISHED */}
        <Field
          ref={c => {
            if (c) FORM_ELEMENTS.elements.published = c;
          }}
          onChange={value => onChange({ published: value.checked })}
          properties={{
            name: 'published',
            label: 'Do you want to set this widget as published?',
            title: 'Published',
            default: form.published,
          }}
        >
          {Checkbox}
        </Field>

        <Field
          ref={c => {
            if (c) FORM_ELEMENTS.elements.provider = c;
          }}
          onChange={value => onChange({ provider: value })}
          validations={['required']}
          options={PROVIDER_OPTIONS}
          properties={{
            name: 'provider',
            label: 'Provider',
            type: 'text',
            required: true,
            default: form.provider,
          }}
        >
          {Select}
        </Field>

        <Field
          ref={c => {
            if (c) FORM_ELEMENTS.elements.description = c;
          }}
          onChange={value => onChange({ description: value })}
          properties={{
            name: 'description',
            label: 'Description',
            type: 'textarea',
            default: form.description,
          }}
        >
          {Textarea}
        </Field>

        <Field
          ref={c => {
            if (c) FORM_ELEMENTS.elements.layerConfig = c;
          }}
          onChange={value => onChange({ layerConfig: value })}
          properties={{
            name: 'layerConfig',
            label: 'Layer config',
            default: form.layerConfig,
          }}
        >
          {Code}
        </Field>

        {layerPreview.errors &&
          this.layerConfigStatus('Layer config not valid!', layerPreview.errors)}

        {layerPreview.errors === false && this.layerConfigStatus('Layer config valid')}

        {form.provider === 'cartodb' && (
          <button type="button" className="c-button -primary" onClick={() => onVerifyLayerConfig()}>
            Verify config
          </button>
        )}

        <Field
          ref={c => {
            if (c) FORM_ELEMENTS.elements.legendConfig = c;
          }}
          onChange={value => onChange({ legendConfig: value })}
          properties={{
            name: 'legendConfig',
            label: 'Legend config',
            default: form.legendConfig,
          }}
        >
          {Code}
        </Field>

        {form.provider !== 'cartodb' && (
          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.interactionConfig = c;
            }}
            onChange={value => onChange({ interactionConfig: value })}
            properties={{
              name: 'interactionConfig',
              label: 'Raster interactivity',
              default: form.interactionConfig,
            }}
          >
            {Code}
          </Field>
        )}

        <LayerPreviewComponent form={form} />

        <Field
          ref={c => {
            if (c) FORM_ELEMENTS.elements.default = c;
          }}
          onChange={value => onChange({ default: value.checked })}
          option={{ label: 'Default' }}
          properties={{
            name: 'default',
            label:
              'Do you want to set this layer as the default one. (Only one default layer per dataset is allowed at a time)',
            title: 'Default',
            default: form.default,
          }}
        >
          {Checkbox}
        </Field>
      </fieldset>
    );
  }
}
Step1.propTypes = {
  form: PropTypes.object.isRequired,
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  layerPreview: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onVerifyLayerConfig: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(Step1);
