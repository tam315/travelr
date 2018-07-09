// @flow
import userReducer, { INITIAL_STATE } from '../userReducer';
import actionTypes from '../../actions/types';
import { DUMMY_USER_STORE } from '../../config/dummies';

describe('user reducer', () => {
  test('GET_OR_CREATE_USER_INFO_SUCCESS', () => {
    const action = {
      type: actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS,
      payload: DUMMY_USER_STORE,
    };

    const expected = { ...DUMMY_USER_STORE };

    expect(userReducer(INITIAL_STATE, action)).toEqual(expected);
  });

  test('FETCH_USER_INFO_SUCCESS', () => {
    const action = {
      type: actionTypes.FETCH_USER_INFO_SUCCESS,
      payload: DUMMY_USER_STORE,
    };

    const expected = { ...DUMMY_USER_STORE };

    expect(userReducer(INITIAL_STATE, action)).toEqual(expected);
  });

  test('UPDATE_USER_INFO_SUCCESS', () => {
    const action = {
      type: actionTypes.UPDATE_USER_INFO_SUCCESS,
      payload: DUMMY_USER_STORE,
    };
    const expected = {
      ...INITIAL_STATE,
      displayName: DUMMY_USER_STORE.displayName,
    };

    expect(userReducer(INITIAL_STATE, action)).toEqual(expected);
  });

  test('DELETE_USER_SUCCESS', () => {
    const action = {
      type: actionTypes.DELETE_USER_SUCCESS,
    };
    const expected = INITIAL_STATE;

    expect(userReducer(INITIAL_STATE, action)).toEqual(expected);
  });
});
