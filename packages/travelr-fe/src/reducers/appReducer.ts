import actionTypes from '../actions/types';
import { AppStore, MapZoomAndCenter } from '../config/types';

export const INITIAL_STATE: AppStore = {
  snackbarQueue: [],
  showProgress: false,
  mapLat: 38.1452368786617,
  mapLng: 137.36165303813937,
  mapZoomLevel: 4,
};

export default (state: AppStore = INITIAL_STATE, action: any): AppStore => {
  switch (action.type) {
    case actionTypes.REDUCE_SNACKBAR_QUEUE: {
      const newState = { ...state };
      newState.snackbarQueue.shift();
      return newState;
    }
    case actionTypes.ADD_SNACKBAR_QUEUE: {
      const newState = {
        ...state,
        snackbarQueue: [...state.snackbarQueue, action.payload],
      };
      return newState;
    }
    case actionTypes.START_PROGRESS: {
      return {
        ...state,
        showProgress: true,
      };
    }
    case actionTypes.FINISH_PROGRESS: {
      return {
        ...state,
        showProgress: false,
      };
    }
    case actionTypes.SAVE_MAP_ZOOM_AND_CENTER: {
      const payload: MapZoomAndCenter = action.payload;
      console.log(payload);
      return {
        ...state,
        mapZoomLevel: payload.zoom,
        mapLng: payload.center.lng,
        mapLat: payload.center.lat,
      };
    }
    default:
      return state;
  }
};
