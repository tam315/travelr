import { shallow } from 'enzyme';
import * as React from 'react';
import { DUMMY_APP_STORE, DUMMY_USER_STORE } from '../../config/dummies';
import { loadJS } from '../../utils/general';
import { App } from '../App';

jest.mock('../../utils/general');

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
        app={DUMMY_APP_STORE}
      />,
    );
    expect(mock.actions.initAuth).toBeCalled();
  });

  test('load google maps API on mount', () => {
    shallow(
      <App
        initAuth={mock.actions.initAuth}
        startProgress={mock.actions.startProgress}
        finishProgress={mock.actions.finishProgress}
        user={DUMMY_USER_STORE}
        app={DUMMY_APP_STORE}
      />,
    );
    expect(loadJS).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(loadJS.mock.calls[0][0]).toContain('maps.googleapis.com/maps/api/');
  });
});
