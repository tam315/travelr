import Enzyme from 'enzyme'; /* eslint-disable-line */
import Adapter from 'enzyme-adapter-react-16'; /* eslint-disable-line */

Enzyme.configure({ adapter: new Adapter() });

// for jest-fetch-mock
// @ts-ignore
global.fetch = require('jest-fetch-mock'); /* eslint-disable-line */
