module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>src/setupTests.ts',
  moduleNameMapper: {
    '^.*\\.(css|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/config/svgStub.js',
  },
  globals: {
    google: true,
    MarkerClusterer: true,
  },
  // console.log will not show without these line
  verbose: false,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
};
