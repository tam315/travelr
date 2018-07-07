// @flow
import { shallow } from 'enzyme';
import React from 'react';
import { App } from '../App';
import { DUMMY_USER_STORE } from '../../config/dummies';
import firebaseUtils from '../../utils/firebaseUtils';

jest.mock('../../utils/firebaseUtils');

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

  test('initial auth setup executed on component mount', () => {
    shallow(
      <App
        fetchUserInfo={mock.actions.fetchUserInfo}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
        user={DUMMY_USER_STORE}
      />,
    );
    expect(firebaseUtils.setupInitialAuth).toBeCalled();
  });
});
