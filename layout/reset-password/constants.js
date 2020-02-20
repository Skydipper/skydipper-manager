export const FORM_ELEMENTS = {
  elements: {},
  validate() {
    const { elements } = this;
    const res = Object.keys(elements).map(k => elements[k].validate());
    return res.every(valid => valid);
  },
};

export const TOKEN_ERROR_MESSAGE =
  'Missing/Invalid token. You need a token to reset your password. Or maybe you token expired/is invalid';

export default {
  FORM_ELEMENTS,
  TOKEN_ERROR_MESSAGE,
};
