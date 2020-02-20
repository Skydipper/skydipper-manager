export const FORM_ELEMENTS = {
  elements: {},
  validate() {
    const { elements } = this;
    const res = Object.keys(elements).map(k => elements[k].validate());
    return res.every(valid => valid);
  },
};

export default { FORM_ELEMENTS };
