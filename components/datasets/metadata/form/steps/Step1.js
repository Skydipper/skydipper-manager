import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import compact from 'lodash/compact';
import { connect } from 'react-redux';

import { setSources } from 'actions/manager/sources';
import { toggleModal as toggleModalAction } from 'actions/modal';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import TextArea from 'components/form/TextArea';
import Title from 'components/ui/Title';
import SourcesContentModal from 'components/datasets/metadata/form/SourcesContentModal';
import { FORM_ELEMENTS, LANGUAGE_OPTIONS } from 'components/datasets/metadata/form/constants';

class Step1 extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    sources: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const { sources } = this.props;

    if (!isEqual(sources, nextProps.sources)) {
      this.onChangeMetadata({ info: { sources: nextProps.sources } });
    }
  }

  onChangeMetadata(obj) {
    const { form, onChange } = this.props;

    let newMetadata;
    if (obj.info) {
      const info = { ...form.info, ...obj.info };
      newMetadata = { ...form, ...{ info } };
    } else {
      newMetadata = { ...form, ...obj };
    }

    onChange(newMetadata);
  }

  onClickAddSources() {
    const { toggleModal } = this.props;

    toggleModal(true, {
      children: SourcesContentModal,
      childrenProps: {
        onClose: () => toggleModal(false, {}),
        onSubmit: () => toggleModal(false, {}),
      },
    });
  }

  render() {
    const { form, sources } = this.props;

    return (
      <div>
        <fieldset className="c-field-container">
          <Title className="-big -secondary">Edit metadata</Title>

          <Title className="-default -secondary">General</Title>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.name = c;
            }}
            onChange={value => this.onChangeMetadata({ name: value })}
            validations={['required']}
            hint="Max length of 75 characters"
            properties={{
              name: 'name',
              label: 'Title',
              type: 'text',
              maxLength: '75',
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
            onChange={value => this.onChangeMetadata({ subtitle: value })}
            properties={{
              name: 'subtitle',
              label: 'Subtitle',
              type: 'text',
              default: form.subtitle,
            }}
          >
            {Input}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.description = c;
            }}
            onChange={value => this.onChangeMetadata({ description: value })}
            validations={['required']}
            properties={{
              name: 'description',
              label: 'Description',
              rows: '6',
              required: true,
              default: form.description,
            }}
          >
            {TextArea}
          </Field>

          {/* Resource Watch ID */}
          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.skydipperId = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { skydipperId: value } })}
            validations={[]}
            properties={{
              name: 'skydipperId',
              label: 'Skydipper ID',
              type: 'text',
              required: false,
              default: form.info.skydipperId,
            }}
          >
            {Input}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.language = c;
            }}
            onChange={value => this.onChangeMetadata({ language: value })}
            validations={['required']}
            options={LANGUAGE_OPTIONS}
            properties={{
              name: 'language',
              label: 'Data language',
              type: 'text',
              disabled: true,
              required: true,
              default: form.language || 'en',
              instanceId: 'selectLanguage',
            }}
          >
            {Select}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.keywords = c;
            }}
            onChange={value => this.onChangeMetadata({ keywords: value })}
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'keywords',
              label: 'Keywords',
              type: 'text',
              creatable: true,
              multi: true,
              required: true,
              placeholder: 'Type keywords',
              default: form.keywords,
            }}
          >
            {Select}
          </Field>
        </fieldset>

        <fieldset className="c-field-container">
          <Title className="-default -secondary">Data info</Title>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.technical_title = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { technical_title: value } })}
            properties={{
              name: 'technical_title',
              label: 'Technical title',
              type: 'text',
              default: form.info.technical_title,
            }}
          >
            {Input}
          </Field>
          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.functions = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { functions: value } })}
            hint="Briefly describes the purpose of the data and what it represents. Max length of 200 characters"
            properties={{
              name: 'functions',
              label: 'Function',
              type: 'text',
              rows: '6',
              maxLength: '200',
              default: form.info.functions,
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.cautions = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { cautions: value } })}
            hint="Describes any limitations of the data set that users should be aware of."
            properties={{
              name: 'cautions',
              label: 'Cautions',
              type: 'text',
              rows: '6',
              default: form.info.cautions,
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.citation = c;
            }}
            onChange={value => this.onChangeMetadata({ citation: value })}
            hint="Unless otherwise specified on Data Sharing Agreement, format should be: Organization name. “Official data layer name as in the ODP.” Accessed through Resource Watch [date]. www.resourcewatch.org (should always end with: Accessed through Resource Watch on [date]. www.resourcewatch.org)"
            properties={{
              name: 'citation',
              label: 'Citation',
              type: 'text',
              rows: '6',
              default: form.citation,
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.geographic_coverage = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { geographic_coverage: value } })}
            hint="Describes the spatial extent of the data set (Note: if Global, write Global. If for a select group of countries, list countries in alphabetical order, use Oxford comma, and include 'the' in country names, e.g., Republic of the Congo)"
            properties={{
              name: 'geographic_coverage',
              label: 'Geographic Coverage',
              type: 'text',
              rows: '6',
              default: form.info.geographic_coverage,
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.spatial_resolution = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { spatial_resolution: value } })}
            hint="Describes the spatial resolution, e.g., 50 meters (50 m in parentheses), 500 × 500 meters (note use of times symbol instead of x), 15 arc second/minute/degree"
            properties={{
              name: 'spatial_resolution',
              label: 'Spatial Resolution',
              type: 'text',
              rows: '6',
              default: form.info.spatial_resolution,
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.date_of_content = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { date_of_content: value } })}
            hint="Date or time period that the data represents (Select the finest level of content - yearly, monthly, weekly, daily - and Other. Under other list the years for which data is available using four digits, separated by a space and a comma, e.g. 2005, 2010, 2015)"
            properties={{
              name: 'date_of_content',
              label: 'Date of Content',
              type: 'text',
              default: form.info.date_of_content,
            }}
          >
            {Input}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.frequency_of_updates = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { frequency_of_updates: value } })}
            hint="Describes how frequently the data set is updated"
            properties={{
              name: 'frequency_of_updates',
              label: 'Frequency of Updates',
              type: 'text',
              default: form.info.frequency_of_updates,
            }}
          >
            {Input}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.license = c;
            }}
            onChange={value => this.onChangeMetadata({ license: value })}
            hint="License under which data are published"
            validations={['required']}
            properties={{
              name: 'license',
              label: 'License',
              type: 'text',
              required: true,
              default: form.license,
            }}
          >
            {Input}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.license_link = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { license_link: value } })}
            validations={['url']}
            properties={{
              name: 'license_link',
              label: 'License link',
              type: 'text',
              default: form.info.license_link,
            }}
          >
            {Input}
          </Field>

          <button
            className="c-button -primary"
            type="button"
            onClick={() => this.onClickAddSources()}
          >
            Add/Remove sources
          </button>

          {sources.length > 0 && (
            <div className="c-metadata-source-list">
              <ul className="source-list">
                {compact(sources).map(source => (
                  <li key={source.id} className="source-item">
                    <div className="source-container">
                      <a
                        className="source-name"
                        href={source['source-name']}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {source['source-name']}
                      </a>
                      {source['source-description'] && (
                        <span className="source-description">{source['source-description']}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </fieldset>

        <fieldset className="c-field-container">
          <Title className="-default -secondary">Translated</Title>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.translated_title = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { translated_title: value } })}
            properties={{
              name: 'translated_title',
              label: 'Translated Title',
              type: 'text',
              default: form.info.translated_title,
            }}
          >
            {Input}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.translated_function = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { translated_function: value } })}
            hint="Briefly describes the purpose of the data and what it represents"
            properties={{
              name: 'translated_function',
              label: 'Translated Function',
              type: 'text',
              rows: '6',
              default: form.info.translated_function,
            }}
          >
            {TextArea}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.translated_description = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { translated_description: value } })}
            hint="Briefly describes the purpose of the data and what it represents"
            properties={{
              name: 'translated_description',
              label: 'Translated Description',
              type: 'text',
              rows: '6',
              default: form.info.translated_description,
            }}
          >
            {TextArea}
          </Field>
        </fieldset>

        <fieldset className="c-field-container">
          <Title className="-default -secondary">Links</Title>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.learn_more_link = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { learn_more_link: value } })}
            validations={['url']}
            properties={{
              name: 'learn_more_link',
              label: 'Learn More link',
              type: 'text',
              default: form.info.learn_more_link,
            }}
          >
            {Input}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.data_download_link = c;
            }}
            onChange={value => this.onChangeMetadata({ info: { data_download_link: value } })}
            validations={['url']}
            properties={{
              name: 'data_download_link',
              label: 'Data Download link',
              type: 'text',
              default: form.info.data_download_link,
            }}
          >
            {Input}
          </Field>

          <Field
            ref={c => {
              if (c) FORM_ELEMENTS.elements.data_download_original_link = c;
            }}
            onChange={value =>
              this.onChangeMetadata({ info: { data_download_original_link: value } })
            }
            validations={['url']}
            properties={{
              name: 'data_download_original_link',
              label: 'Download from Original Source link',
              type: 'text',
              default: form.info.data_download_original_link,
            }}
          >
            {Input}
          </Field>
        </fieldset>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sources: state.sources.sources,
});

const mapDispatchToProps = {
  toggleModal: toggleModalAction,
  setSources,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Step1);
