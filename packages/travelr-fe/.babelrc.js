module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-stage-3', // for class-properties & object-rest-spread
    '@babel/preset-typescript',
  ],
  plugins: [
    // import optimization
    //
    // e.g.)
    // import { SomeParts } from 'some-entire-library'
    // ↓
    // import Someparts from 'some-entire-library/Someparts'
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '', // default: lib
        camel2DashComponentName: false, // default: true
      },
      'optimize-lodash', // anything some unique
    ],
    [
      'import',
      {
        libraryName: '@material-ui/core',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'optimize-@material-ui/core',
    ],
  ],
};
