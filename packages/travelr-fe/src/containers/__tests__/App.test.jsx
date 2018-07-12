// @flow
import { shallow } from 'enzyme';
import React from 'react';
import { DUMMY_USER_STORE } from '../../config/dummies';
import { App } from '../App';

jest.mock('../../utils/firebaseUtils');

describe('App component', () => {
  let mock;

  beforeEach(() => {
    jest.resetAllMocks();
    mock = {
      actions: {
        initAuth: jest.fn(),
        startProgress: jest.fn(),
        finishProgress: jest.fn(),
      },
    };
  });

  test('initAuth() is called on mount', () => {
    shallow(
      <App
        initAuth={mock.actions.initAuth}
        startProgress={mock.actions.startProgress}
        finishProgress={mock.actions.finishProgress}
        user={DUMMY_USER_STORE}
      />,
    );
    expect(mock.actions.initAuth).toBeCalled();
  });
});
