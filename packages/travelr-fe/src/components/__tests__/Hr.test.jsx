import Divider from '@material-ui/core/Divider';
import { mount } from 'enzyme';
import React from 'react';
import Hr from '../Hr';

describe('Hr component', () => {
  test('show text and two dividers if text is provided', () => {
    const wrapper = mount(<Hr text="dummyText" />);
    expect(wrapper.text()).toContain('dummyText');
    expect(wrapper.find(Divider)).toHaveLength(2);
  });

  test('show one divider if text is NOT provided', () => {
    const wrapper = mount(<Hr />);
    expect(wrapper.find(Divider)).toHaveLength(1);
  });
});
