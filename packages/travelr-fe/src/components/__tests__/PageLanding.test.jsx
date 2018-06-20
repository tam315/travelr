import Button from '@material-ui/core/Button';
import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PageLanding from '../PageLanding';

describe('Header component', () => {
  describe('if user is signed out', () => {
    let wrapper;

    beforeEach(() => {
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
});
