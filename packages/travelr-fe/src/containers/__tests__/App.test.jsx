// @flow
import { shallow } from 'enzyme';
import React from 'react';
import { DUMMY_USER_STORE } from '../../config/dummies';
import firebaseUtils from '../../utils/firebaseUtils';
import { App } from '../App';

jest.mock('../../utils/firebaseUtils');

describe('App component', () => {
  let mock;

  beforeEach(() => {
    jest.resetAllMocks();
    mock = {
      actions: {
        getOrCreateUserInfo: jest.fn(),
        fetchUserInfo: jest.fn(),
        startProgress: jest.fn(),
        finishProgress: jest.fn(),
        addSnackbarQueue: jest.fn(),
      },
    };
  });

  test('if user is NOT redirected and have NO token', done => {
    shallow(
      <App
        fetchUserInfo={mock.actions.fetchUserInfo}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
        startProgress={mock.actions.startProgress}
        finishProgress={mock.actions.finishProgress}
        addSnackbarQueue={mock.actions.addSnackbarQueue}
        user={DUMMY_USER_STORE}
      />,
    );
    setImmediate(() => {
      expect(mock.actions.startProgress).toBeCalled();
      expect(firebaseUtils.getRedirectResult).toBeCalled();
      expect(mock.actions.getOrCreateUserInfo).not.toBeCalled();
      expect(firebaseUtils.getCurrentUser).toBeCalled();
      expect(firebaseUtils.onAuthStateChanged).toBeCalled();
      expect(mock.actions.finishProgress).toBeCalled();
      done();
    });
  });

  test('if user is NOT redirected and HAVE token', done => {
    // $FlowIgnore
    firebaseUtils.getCurrentUser = jest.fn().mockResolvedValue({});
    shallow(
      <App
        fetchUserInfo={mock.actions.fetchUserInfo}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
        startProgress={mock.actions.startProgress}
        finishProgress={mock.actions.finishProgress}
        addSnackbarQueue={mock.actions.addSnackbarQueue}
        user={DUMMY_USER_STORE}
      />,
    );
    setImmediate(() => {
      expect(mock.actions.startProgress).toBeCalled();
      expect(firebaseUtils.getRedirectResult).toBeCalled();
      expect(firebaseUtils.getCurrentUser).toBeCalled();
      expect(mock.actions.getOrCreateUserInfo).toBeCalledTimes(1);
      expect(firebaseUtils.onAuthStateChanged).toBeCalled();
      expect(mock.actions.finishProgress).toBeCalled();
      done();
    });
  });

  test('if user is redirected', done => {
    // $FlowIgnore
    firebaseUtils.getRedirectResult = jest.fn().mockResolvedValue({});
    shallow(
      <App
        fetchUserInfo={mock.actions.fetchUserInfo}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
        startProgress={mock.actions.startProgress}
        finishProgress={mock.actions.finishProgress}
        addSnackbarQueue={mock.actions.addSnackbarQueue}
        user={DUMMY_USER_STORE}
      />,
    );
    setImmediate(() => {
      expect(mock.actions.startProgress).toBeCalled();
      expect(firebaseUtils.getRedirectResult).toBeCalled();
      expect(mock.actions.getOrCreateUserInfo).toBeCalledTimes(1);
      expect(firebaseUtils.getCurrentUser).not.toBeCalled();
      expect(firebaseUtils.onAuthStateChanged).toBeCalled();
      expect(mock.actions.finishProgress).toBeCalled();
      done();
    });
  });
});
