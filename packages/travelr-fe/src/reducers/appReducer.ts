import actionTypes from '../actions/types';
import { AppStore } from '../config/types';

export const INITIAL_STATE: AppStore = {
  snackbarQueue: [],
  showProgress: false,
  mapLat: 0,
  mapLng: 0,
  mapZoomLevel: 0,
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
    default:
      return state;
  }
};
