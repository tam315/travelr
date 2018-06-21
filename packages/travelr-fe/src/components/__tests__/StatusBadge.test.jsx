import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import StatusBadge from '../StatusBadge';

describe('StatusBadge component', () => {
  test('shows count', () => {
    const wrapper = mount(
      <BrowserRouter>
        <StatusBadge icon="like" count={999} />
      </BrowserRouter>,
    );
    expect(wrapper.text()).toContain('999');
  });
});
