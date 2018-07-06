// @flow
import { shallow } from 'enzyme';
import React from 'react';
import { App } from '../App';
import store from 'store';
import { DUMMY_USER_STORE } from '../../config/dummies';

jest.mock('store');

describe('App component', () => {
  let mock;
  const DUMMY_TOKEN = DUMMY_USER_STORE.token;

  beforeEach(() => {
    store.get.mockImplementation(() => DUMMY_TOKEN);
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
    expect(store.get).toBeCalledWith('token');
    expect(mock.actions.getOrCreateUserInfo).toBeCalledWith(DUMMY_TOKEN);
  });
});
