import Divider from '@material-ui/core/Divider';
import { shallow } from 'enzyme';
import * as React from 'react';
import Hr from '../Hr';

describe('Hr component', () => {
  test('show text and two dividers if text is provided', () => {
    const wrapper = shallow(<Hr text="dummyText" />);
    expect(wrapper.html()).toContain('dummyText');
    expect(wrapper.dive().find(Divider)).toHaveLength(2);
  });

  test('show one divider if text is NOT provided', () => {
    const wrapper = shallow(<Hr />);
    expect(wrapper.dive().find(Divider)).toHaveLength(1);
  });
});
