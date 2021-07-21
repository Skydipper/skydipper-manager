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

export const DATASETS_MOCK = {
  data: [
    {
      bands: [
        'B1',
        ' B2',
        ' B3',
        ' B4',
        ' B5',
        ' B6',
        ' B7',
        ' B8A',
        ' B8',
        ' B11',
        ' B12',
        ' ndvi',
        ' ndwi',
      ],
      bbox: [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
      bounds: [[-90, -180], [90, 180]],
      name: 'Sentinel 2 Top-of-Atmosphere Reflectance',
      provider: 'gee',
      rgb_bands: ['B4', ' B3', ' B2'],
      slug: 'Sentinel-2-Top-of-Atmosphere-Reflectance',
      temporal_range: ['2015-06-23', ''],
    },
    {
      bands: ['B1', ' B2', ' B3', ' B4', ' B5', ' B6', ' B7', ' ndvi', ' ndwi'],
      bbox: [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
      bounds: [[-90, -180], [90, 180]],
      name: 'Landsat 7 Surface Reflectance',
      provider: 'gee',
      rgb_bands: ['B3', ' B2', ' B1'],
      slug: 'Landsat-7-Surface-Reflectance',
      temporal_range: ['1999-01-01', ''],
    },
    {
      bands: ['B1', ' B2', ' B3', ' B4', ' B5', ' B6', ' B7', ' B10', ' B11', ' ndvi', ' ndwi'],
      bbox: [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
      bounds: [[-90, -180], [90, 180]],
      name: 'Landsat 8 Surface Reflectance',
      provider: 'gee',
      rgb_bands: ['B4', ' B3', ' B2'],
      slug: 'Landsat-8-Surface-Reflectance',
      temporal_range: ['2013-04-01', ''],
    },
    {
      bands: ['landcover', ' cropland', ' land', ' water', ' urban'],
      bbox: [
        [-127.9048681148588, 22.939940979385966],
        [-65.32751227051303, 22.939940979385966],
        [-65.32751227051303, 51.65348178159676],
        [-127.9048681148588, 51.65348178159676],
        [-127.9048681148588, 22.939940979385966],
      ],
      bounds: [[22.939940979385966, -127.9048681148588], [51.65348178159676, -65.32751227051303]],
      name: 'USDA NASS Cropland Data Layers',
      provider: 'gee',
      rgb_bands: ['landcover'],
      slug: 'USDA-NASS-Cropland-Data-Layers',
      temporal_range: ['1997-01-01', ''],
    },
    {
      bands: ['impervious'],
      bbox: [
        [156.5648945649627, 17.013750019211816],
        [296.3635835582712, 17.013750019211816],
        [296.3635835582712, 71.43885304869943],
        [156.5648945649627, 71.43885304869943],
        [156.5648945649627, 17.013750019211816],
      ],
      bounds: [[17.013750019211816, 156.5648945649627], [71.43885304869943, 296.3635835582712]],
      name: 'USGS National Land Cover Database',
      provider: 'gee',
      rgb_bands: ['impervious'],
      slug: 'USGS-National-Land-Cover-Database',
      temporal_range: ['1992-01-01', '2017-01-01'],
    },
    {
      bands: ['turbidity_blended_mean'],
      bbox: [
        [-10.062783058455986, 34.9033865391524],
        [3.452111097038824, 34.9033865391524],
        [3.452111097038824, 43.903262833928636],
        [-10.062783058455986, 43.903262833928636],
        [-10.062783058455986, 34.9033865391524],
      ],
      bounds: [[34.9033865391524, -10.062783058455986], [43.903262833928636, 3.452111097038824]],
      name: 'Lake Water Quality 100m',
      provider: 'gee',
      rgb_bands: ['turbidity_blended_mean'],
      slug: 'Lake-Water-Quality-100m',
      temporal_range: ['2019-01-01', '2019-12-31'],
    },
  ],
};

export const INPUT_OUTPUT_IMAGES_MOCK = {
  data: {
    input_image:
      'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/1676037e03cdfcef30e2376390498e48-76c19848305a31f38de9a0a3088b141c/tiles/{z}/{x}/{y}',
    output_image:
      'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/d48d16c3d1456cdea9f66cab30102852-e83bd3542f116bf9e8cb5da50866ba17/tiles/{z}/{x}/{y}',
  },
};

export const INPUT_OUTPUT_BANDS_MOCK = {
  data: {
    norm_bands: {
      input_bands: {
        "['B1']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/18fbb244b0a7275cef21f35414c40838-04f41f4d761e31848995b4cc17965595/tiles/{z}/{x}/{y}',
        "['B10']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/940f792b5ee9c10dabeff63dfae072d2-446412d5f0dac4c554085f20afc0bd2a/tiles/{z}/{x}/{y}',
        "['B11']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/60031f95075bafafcc4a3cc5bb2e47cc-f1ec58755db2cfc154a644be335df66c/tiles/{z}/{x}/{y}',
        "['B4', 'B3', 'B2']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/72465468377c4a805ad59ac1837889ca-1e644d5410936b51f62e0ff98973b3ad/tiles/{z}/{x}/{y}',
        "['B5']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/7bc277b050bdd7b31065cb7f893b9ac5-e48285ddfbc857c3609f6dbb644aab97/tiles/{z}/{x}/{y}',
        "['B6']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/c0c6ba6d364040f6d742792e318aeb9c-417dbaa234d18c99fc451967306cb470/tiles/{z}/{x}/{y}',
        "['B7']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/c6744c458b116edc8ea0aade8a143ef2-5ee9c0df056b1a0a23bdeed6d6ff4ff0/tiles/{z}/{x}/{y}',
        "['ndvi']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/b1a02662cd2859387a3333f420fa1349-c9efdc46efd455d48a98aeb098bb2f80/tiles/{z}/{x}/{y}',
        "['ndwi']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/b1d834c9a8e4380661ae3a68603bb6f0-c390dfd1b037b76daa7663e91f38c42a/tiles/{z}/{x}/{y}',
      },
      output_bands: {
        "['cropland']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/6bc026c8d108489d1bc1b059e87fc728-b588c1913070d3e01e92b8bef825e436/tiles/{z}/{x}/{y}',
        "['land']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/add0676962df830aef383a54fcd3d03e-25e66d397f8fd1fa7c7d94c7325f2d29/tiles/{z}/{x}/{y}',
        "['landcover']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/d48d16c3d1456cdea9f66cab30102852-4516799c3c6b61490137696d662d2dfa/tiles/{z}/{x}/{y}',
        "['urban']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/dcc5451e6104338bb98a895f92c7d369-1fe0ed779494a8605e20c466a99aecf3/tiles/{z}/{x}/{y}',
        "['water']":
          'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/71b143c66ca6a8505ea7ab5babb21d86-4310d9a664c70d614652bd7ddb8a2a13/tiles/{z}/{x}/{y}',
      },
    },
  },
};
