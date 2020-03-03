export const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'Português', value: 'pt' },
];

export const FORM_DEFAULT_STATE = {
  authorization: '',
  description: '',
  name: '',
  language: 'en',
  info: {},
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
