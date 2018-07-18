import appReducer, { INITIAL_STATE } from '../appReducer';
import types from '../../actions/types';
import { TaskName } from '../../config/types';

describe('appReducer', () => {
  test('REDUCE_SNACKBAR_QUEUE', () => {
    const state = {
      ...INITIAL_STATE,
      snackbarQueue: ['message1', 'message2', 'message3'],
    };

    const action = {
      type: types.REDUCE_SNACKBAR_QUEUE,
    };

    const expected = {
      ...INITIAL_STATE,
      snackbarQueue: ['message2', 'message3'],
    };

    expect(appReducer(state, action)).toEqual(expected);
  });

  test('ADD_SNACKBAR_QUEUE', () => {
    const state = {
      ...INITIAL_STATE,
      snackbarQueue: ['message1', 'message2', 'message3'],
    };

    const action = {
      type: types.ADD_SNACKBAR_QUEUE,
      payload: 'message4',
    };

    const expected = {
      ...INITIAL_STATE,
      snackbarQueue: ['message1', 'message2', 'message3', 'message4'],
    };

    expect(appReducer(state, action)).toEqual(expected);
  });

  test('START_PROGRESS', () => {
    const state = {
      ...INITIAL_STATE,
      tasksInProgress: <TaskName[]>['fetch'],
    };

    const action = {
      type: types.START_PROGRESS,
      payload: 'signin',
    };

    const expected = {
      ...INITIAL_STATE,
      tasksInProgress: ['fetch', 'signin'],
    };

    expect(appReducer(state, action)).toEqual(expected);
  });

  test('FINISH_PROGRESS', () => {
    const state = {
      ...INITIAL_STATE,
      tasksInProgress: <TaskName[]>['fetch', 'signin'],
    };

    const action = {
      type: types.FINISH_PROGRESS,
      payload: 'fetch',
    };

    const expected = {
      ...INITIAL_STATE,
      tasksInProgress: ['signin'],
    };

    expect(appReducer(state, action)).toEqual(expected);
  });
});
