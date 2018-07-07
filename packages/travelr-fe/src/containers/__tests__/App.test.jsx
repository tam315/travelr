// @flow
import { shallow } from 'enzyme';
import React from 'react';
import { App } from '../App';
import { DUMMY_USER_STORE } from '../../config/dummies';

describe('App component', () => {
  let mock;

  beforeEach(() => {
    mock = {
      actions: {
        getOrCreateUserInfo: jest.fn(),
        fetchUserInfo: jest.fn(),
      },
    };
  });

  test('read token from local storage and fetch user info on component mount', () => {
    shallow(
      <App
        fetchUserInfo={mock.actions.fetchUserInfo}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
        user={DUMMY_USER_STORE}
      />,
    );
  });
});
