// @flow
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { shallow } from 'enzyme';
import React from 'react';
import Header from '../Header';

describe('Header component', () => {
  describe('if user is signed out', () => {
    let wrapper;

    beforeAll(() => {
      wrapper = shallow(<Header user={{}} />);
    });

    test('shows site title', () => {
      expect(
        wrapper
          .dive()
          .find(Button)
          .at(0)
          .children()
          .children()
          .text(),
      ).toBe('Travelr');
    });

    test('shows humberger icon', () => {
      expect(wrapper.dive().find(IconButton)).toHaveLength(1);
    });

    test('shows Signup/In button', () => {
      expect(
        wrapper
          .dive()
          .find(Button)
          .at(1)
          .children()
          .text(),
      ).toContain('Signup / In');
    });
  });

  describe('if user is signed in', () => {
    let wrapper;

    beforeAll(() => {
      const store = { user: { userId: 'dummyId', displayName: 'dummyName' } };
      wrapper = shallow(<Header {...store} />);
    });

    test('shows userStatusButton', () => {
      const userStatus = wrapper
        .dive()
        .find(Button)
        .at(1);

      expect(userStatus.find(AccountCircle)).toHaveLength(1);
      expect(
        userStatus
          .children()
          .children()
          .text(),
      ).toBe('dummyName');
    });
  });
});
