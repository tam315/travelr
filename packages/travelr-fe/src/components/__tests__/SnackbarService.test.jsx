import { shallow, mount } from 'enzyme';
import React from 'react';
import { SnackbarService } from '../SnackbarService';

describe('SnackbarService component', () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    mock = {
      actions: {
        reduceSnackbarQueue: jest.fn(),
      },
    };

    wrapper = shallow(
      <SnackbarService
        app={{}}
        reduceSnackbarQueue={mock.actions.reduceSnackbarQueue}
      />,
    );
  });

  test("doesn't start processing queues if the app.snackbarQueue is empty", () => {
    expect(mock.actions.reduceSnackbarQueue).toHaveBeenCalledTimes(0);
  });

  test('do start processing queues if the app.snackbarQueue has contents', () => {
    const appState = {
      snackbarQueue: ['message1'],
    };

    wrapper.setProps({ app: appState });
    expect(mock.actions.reduceSnackbarQueue).toHaveBeenCalledTimes(1);
  });

  test('processing queues occurs many times if the app.snackbarQueue has several contents', () => {
    jest.useFakeTimers();

    const appState = {
      snackbarQueue: [
        'message1',
        'message2',
        'message3',
        'message4',
        'message5',
      ],
    };

    // mock 'reduceSnackbarQueue' action
    // (reduces queses one by one for each invoking)
    mock.actions.reduceSnackbarQueue.mockImplementation(() => {
      appState.snackbarQueue.shift();
      wrapper.setProps({
        app: appState,
      });
    });

    wrapper = mount(
      <SnackbarService
        app={{}}
        reduceSnackbarQueue={mock.actions.reduceSnackbarQueue}
      />,
    );

    wrapper.setProps({
      app: appState,
    });

    // all queues will be processed eventually
    jest.runAllTimers();
    expect(mock.actions.reduceSnackbarQueue).toHaveBeenCalledTimes(5);
  });
});
