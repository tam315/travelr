// @flow
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PageAuth from '../PageAuth';

describe('PageAuth component', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(
      <BrowserRouter>
        <PageAuth />
      </BrowserRouter>,
    );
  });

  test('displays 3 buttons(google, facebok, mail-address-auth)', () => {
    expect(wrapper.find(Button)).toHaveLength(3);
  });
  test('displays 2 TextField for mail and password', () => {
    expect(wrapper.find(TextField)).toHaveLength(2);
  });
});
