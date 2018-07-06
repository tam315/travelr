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
      // to test both with and without redirects,
      // these mocks are reimplemented at a later time
      getRedirectResult: jest.fn().mockResolvedValue({
        user: '', // mock a firebase sdk as if there were no redirect result
      }),
      getIdToken: jest.fn().mockResolvedValue('dummy_token'),
      signInWithRedirect: jest.fn(),
    };

    // note that firebase.auth can NOT be changed except this place
    firebase.auth = jest.fn(() => ({
      getRedirectResult: mock.getRedirectResult,
      currentUser: { getIdToken: mock.getIdToken },
      signInWithRedirect: mock.signInWithRedirect,
    }));
    // function constructors
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

  test('getOrCreateUserInfo() is NOT called if there are no redirect results', done => {
    shallow(
      <PageAuth
        classes={{}}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
      />,
    );

    process.nextTick(() => {
      expect(mock.getRedirectResult).toHaveBeenCalled();
      expect(mock.getIdToken).not.toHaveBeenCalled();
      expect(mock.actions.getOrCreateUserInfo).not.toHaveBeenCalled();
      done();
    });
  });

  test('getOrCreateUserInfo() is called if there are redirect results', done => {
    mock.getRedirectResult = jest.fn().mockResolvedValue({
      // mock a firebase sdk as if there ARE redirect result.
      user: 'dummy_user_info',
      additionalUserInfo: {
        profile: {
          given_name: 'dummy_user_name',
        },
      },
    });
    mock.getIdToken = jest.fn().mockResolvedValue('dummy_token');

    shallow(
      <PageAuth
        classes={{}}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
      />,
    );

    process.nextTick(() => {
      expect(mock.getRedirectResult).toHaveBeenCalled();
      expect(mock.getIdToken).toHaveBeenCalled();
      expect(mock.actions.getOrCreateUserInfo).toHaveBeenCalled();
      expect(mock.actions.getOrCreateUserInfo).toHaveBeenCalledWith(
        'dummy_token',
        'dummy_user_name',
      );
      done();
    });
  });
});
