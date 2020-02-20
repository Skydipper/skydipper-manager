export const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'Português', value: 'pt' },
];

export const RASTER_COLUMN_TYPES = [
  { label: 'Categorical', value: 'categorical' },
  { label: 'Continuous', value: 'continuous' },
];

export const STATE_DEFAULT = {
  step: 1,
  stepLength: 1,
  submitting: false,
  loading: false,
  form: {
    authorization: '',
    source: '',
    description: '',
    name: '',
    language: 'en',
    info: {},
    columns: {},
  },
};

export const FORM_ELEMENTS = {
  elements: {},
  validate() {
    const { elements } = this;
    const res = Object.keys(elements).map(k => elements[k].validate());
    return res.every(valid => valid);
  },
};

export const SOURCE_ELEMENTS = {
  elements: {},
  validate() {
    const { elements } = this;
    const res = Object.keys(elements).map(k => elements[k].validate());
    return res.every(valid => valid);
  },
};
