// @flow
import { PageAuth } from '../PageAuth';
import { shallow } from 'enzyme';
import React from 'react';
import firebase from 'firebase/app';
import { Button, TextField } from '@material-ui/core';

jest.mock('firebase/app');

describe('', () => {
  let mock;

  beforeEach(() => {
    mock = {
      actions: {
        getOrCreateUserInfo: jest.fn(),
      },
      signInWithRedirect: jest.fn(),
    };

    // note that firebase.auth can NOT be changed except this place
    firebase.auth = jest.fn(() => ({
      signInWithRedirect: mock.signInWithRedirect,
    }));
    firebase.auth.GoogleAuthProvider = jest.fn(() => ({ addScope: jest.fn() }));
    firebase.auth.FacebookAuthProvider = jest.fn(() => ({
      addScope: jest.fn(),
    }));
  });

  test('displays 3 buttons(google, facebok, mail-address-auth)', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
      />,
    );
    expect(wrapper.find(Button)).toHaveLength(3);
  });

  test('displays 2 TextField for mail and password', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
      />,
    );
    expect(wrapper.find(TextField)).toHaveLength(2);
  });

  test('signInWithRedirect is called when a google button is clicked', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
      />,
    );

    wrapper
      .find(Button)
      .at(0)
      .simulate('click');

    expect(mock.signInWithRedirect).toBeCalled();
  });

  test('signInWithRedirect is called when a facebook button is clicked', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
      />,
    );

    wrapper
      .find(Button)
      .at(1)
      .simulate('click');

    expect(mock.signInWithRedirect).toBeCalled();
  });
});
