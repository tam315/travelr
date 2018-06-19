import React from 'react';
import { mount, shallow } from 'enzyme';
import Header from '../Header';
import { BrowserRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';

describe('Header component', () => {
  describe('if user is signed out', () => {
    let wrapper;

    beforeAll(() => {
      wrapper = mount(
        <BrowserRouter>
          <Header />
        </BrowserRouter>,
      );
    });

    test('shows site title', () => {
      expect(
        wrapper
          .find(Button)
          .at(0)
          .text(),
      ).toContain('Travelr');
    });

    test('shows humberger icon', () => {
      expect(wrapper.find(IconButton)).toHaveLength(1);
    });

    test('shows Signup/In button', () => {
      expect(
        wrapper
          .find(Button)
          .at(1)
          .html(),
      ).toContain('Signup');
    });
  });

  describe('if user is signed in', () => {
    let wrapper;

    beforeAll(() => {
      const store = { user: { userId: 'dummyId', displayName: 'dummyName' } };
      wrapper = mount(
        <BrowserRouter>
          <Header {...store} />
        </BrowserRouter>,
      );
    });

    test('shows button to account page', () => {
      expect(
        wrapper
          .find(Button)
          .at(1)
          .find(AccountCircle),
      ).toHaveLength(1);
      expect(
        wrapper
          .find(Button)
          .at(1)
          .text(),
      ).toContain('dummyName');
    });
  });
});
