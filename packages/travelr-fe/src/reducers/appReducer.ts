import actionTypes from '../actions/types';
import { AppStore } from '../config/types';

export const INITIAL_STATE: AppStore = {
  snackbarQueue: [],
  tasksInProgress: [],
};

export default (state: AppStore = INITIAL_STATE, action: any) => {
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
      const tasksInProgress = [...state.tasksInProgress];
      const index = tasksInProgress.indexOf(action.payload);
      if (index === -1) {
        tasksInProgress.push(action.payload);
      }
      return {
        ...state,
        tasksInProgress,
      };
    }
    case actionTypes.FINISH_PROGRESS: {
      const tasksInProgress = [...state.tasksInProgress];
      const index = tasksInProgress.indexOf(action.payload);
      if (index !== -1) {
        tasksInProgress.splice(index, 1);
      }
      return {
        ...state,
        tasksInProgress,
      };
    }
    default:
      return state;
  }
};
