import types from '../../actions/types';
import appReducer, { INITIAL_STATE } from '../appReducer';
import { MapZoomAndCenter } from '../../config/types';

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
      showProgress: false,
    };

    const action = {
      type: types.START_PROGRESS,
    };

    const expected = {
      ...INITIAL_STATE,
      showProgress: true,
    };

    expect(appReducer(state, action)).toEqual(expected);
  });

  test('FINISH_PROGRESS', () => {
    const state = {
      ...INITIAL_STATE,
      showProgress: true,
    };

    const action = {
      type: types.FINISH_PROGRESS,
    };

    const expected = {
      ...INITIAL_STATE,
      showProgress: false,
    };

    expect(appReducer(state, action)).toEqual(expected);
  });

  test('SAVE_MAP_ZOOM_AND_CENTER', () => {
    const state = {
      ...INITIAL_STATE,
    };

    const action = {
      type: types.SAVE_MAP_ZOOM_AND_CENTER,
      payload: <MapZoomAndCenter>{
        zoom: 10,
        center: { lat: 1, lng: 2 },
      },
    };

    const expected = {
      ...INITIAL_STATE,
      mapZoomLevel: 10,
      mapLat: 1,
      mapLng: 2,
    };

    expect(appReducer(state, action)).toEqual(expected);
  });

  test('OPEN_DIALOG', () => {
    const DUMMY_PAYLOAD = {
      dialogTitle: 'dummy_title',
      dialogContent: 'dummy_content',
      dialogPositiveSelector: 'dummy_selector1',
      dialogNegativeSelector: 'dummy_selector2',
      dialogSuccessCallback: () => {},
    };

    const action = {
      type: types.OPEN_DIALOG,
      payload: DUMMY_PAYLOAD,
    };

    const expected = {
      ...INITIAL_STATE,
      ...DUMMY_PAYLOAD,
      dialogIsOpen: true,
    };

    expect(appReducer(INITIAL_STATE, action)).toEqual(expected);
  });

  test('CLOSE_DIALOG', () => {
    const state = {
      ...INITIAL_STATE,
      dialogTitle: 'dummy_title',
      dialogContent: 'dummy_content',
      dialogPositiveSelector: 'dummy_selector1',
      dialogNegativeSelector: 'dummy_selector2',
      dialogSuccessCallback: () => {},
    };
    const action = {
      type: types.CLOSE_DIALOG,
    };

    const expected = {
      ...state,
      dialogIsOpen: false,
    };

    expect(appReducer(state, action)).toEqual(expected);
  });

  test('UPDATE_MAP_ZOOM_AND_CENTER_SUCCESS', () => {
    const DUMMY_PAYLOAD = { lat: 1, lng: 2, radius: '3' };
    const action = {
      type: types.UPDATE_MAP_ZOOM_AND_CENTER_SUCCESS,
      payload: DUMMY_PAYLOAD,
    };

    const expected = {
      ...INITIAL_STATE,
      mapLatUpdated: DUMMY_PAYLOAD.lat,
      mapLngUpdated: DUMMY_PAYLOAD.lng,
      mapZoomLevelUpdated: 11,
    };

    expect(appReducer(INITIAL_STATE, action)).toEqual(expected);
  });
});
