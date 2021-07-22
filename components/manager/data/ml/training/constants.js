export const NORMALIZATION_TYPES = [
  {
    label: 'Global',
    value: 'global',
  },
  {
    label: 'Polygons',
    value: 'polygons',
  },
];

export const INPUT_TYPES = [
  {
    label: 'Images',
    value: 'Images',
  },
  {
    label: 'Vectors',
    value: 'Vectors',
  },
];

export const MODEL_TYPES_BY_INPUT_TYPE = {
  Images: [
    {
      label: 'Convolutional Neural Network',
      value: 'CNN',
    },
  ],
  Vectors: [
    {
      label: 'Multilayer Perceptron',
      value: 'MLP',
    },
  ],
};

export const OUTPUT_TYPES_BY_MODEL_TYPE = {
  CNN: [
    {
      label: 'Regression',
      value: 'regression',
    },
    {
      label: 'Segmentation',
      value: 'segmentation',
    },
  ],
  MLP: [
    {
      label: 'Regression',
      value: 'regression',
    },
  ],
};

export const MODEL_ARCHITECTURES_BY_MODEL_TYPE_AND_OUTPUT_TYPE = {
  CNN: {
    regression: [
      { label: 'deepvel', value: 'deepvel' },
      { label: 'segnet', value: 'segnet' },
      { label: 'unet', value: 'unet' },
    ],
    segmentation: [
      { label: 'deepvel', value: 'deepvel' },
      { label: 'segnet', value: 'segnet' },
      { label: 'unet', value: 'unet' },
    ],
  },
  MLP: {
    regression: [{ label: 'sequential1', value: 'sequential1' }],
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
