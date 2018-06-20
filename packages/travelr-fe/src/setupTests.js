import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// for jest-fetch-mock
global.fetch = require('jest-fetch-mock');
