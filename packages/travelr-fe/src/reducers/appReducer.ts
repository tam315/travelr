import actionTypes from '../actions/types';
import { AppStore, MapZoomAndCenter } from '../config/types';

export const INITIAL_STATE: AppStore = {
  snackbarQueue: [],
  tasksInProgress: new Set(),
  mapLat: 38.1452368786617,
  mapLng: 137.36165303813937,
  mapZoomLevel: 4,
  mapLatUpdated: null,
  mapLngUpdated: null,
  mapZoomLevelUpdated: null,
  dialogIsOpen: false,
  dialogTitle: '',
  dialogContent: '',
  dialogPositiveSelector: '',
  dialogNegativeSelector: '',
  dialogSuccessCallback: null,
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
      const newSet = new Set(state.tasksInProgress);
      newSet.add(action.payload);
      return {
        ...state,
        tasksInProgress: newSet,
      };
    }
    case actionTypes.FINISH_PROGRESS: {
      const newSet = new Set(state.tasksInProgress);
      newSet.delete(action.payload);
      return {
        ...state,
        tasksInProgress: newSet,
      };
    }
    case actionTypes.SAVE_MAP_ZOOM_AND_CENTER: {
      const payload: MapZoomAndCenter = action.payload;
      return {
        ...state,
        mapZoomLevel: payload.zoom,
        mapLng: payload.center.lng,
        mapLat: payload.center.lat,
      };
    }
    case actionTypes.OPEN_DIALOG: {
      return {
        ...state,
        dialogIsOpen: true,
        dialogTitle: '',
        dialogContent: '',
        dialogPositiveSelector: '',
        dialogNegativeSelector: '',
        dialogSuccessCallback: null,
        ...action.payload,
      };
    }
    case actionTypes.CLOSE_DIALOG: {
      return {
        ...state,
        dialogIsOpen: false,
      };
    }
    case actionTypes.UPDATE_MAP_ZOOM_AND_CENTER_SUCCESS: {
      const { lat, lng, radius } = action.payload;
      // prettier-ignore
      const zoomLevel =
        +radius < 10 ? 11 :
        +radius < 20 ? 10 :
        +radius < 50 ? 9 :
        +radius < 100 ? 8 :
        +radius < 200 ? 7 : 6;
      return {
        ...state,
        mapLatUpdated: lat,
        mapLngUpdated: lng,
        mapZoomLevelUpdated: zoomLevel,
      };
    }
    default:
      return state;
  }
};
