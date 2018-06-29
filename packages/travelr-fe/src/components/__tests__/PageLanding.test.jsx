// @flow
import Button from '@material-ui/core/Button';
import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PageLanding from '../PageLanding';

describe('PageLanding component', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(
      <BrowserRouter>
        <PageLanding />
      </BrowserRouter>,
    );
  });

  test('displays title', () => {
    expect(wrapper.text()).toContain('Travelr');
  });
  test('displays link to /all-grid', () => {
    expect(wrapper.find(Button).props().to).toBe('/all-grid');
  });
});
