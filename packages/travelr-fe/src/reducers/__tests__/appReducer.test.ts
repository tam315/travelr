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
});
