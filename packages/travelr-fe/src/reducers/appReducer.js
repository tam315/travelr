import types from '../actions/types';

const INITIAL_STATE = {
  snackbarQueue: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.REDUCE_SNACKBAR_QUEUE: {
      const newState = { ...state };
      newState.snackbarQueue.shift();
      return newState;
    }
    case types.FETCH_ALL_POSTS_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の取得に失敗しました'],
      };
    }
    case types.CREATE_POST_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の取得に失敗しました'],
      };
    }
    case types.FETCH_USER_INFO_FAIL: {
      return {
        snackbarQueue: [
          ...state.snackbarQueue,
          'ユーザ情報の取得に失敗しました',
        ],
      };
    }
    case types.UPDATE_USER_INFO_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, 'ユーザ情報を更新しました'],
      };
    }
    case types.UPDATE_USER_INFO_FAIL: {
      return {
        snackbarQueue: [
          ...state.snackbarQueue,
          'ユーザ情報の更新に失敗しました',
        ],
      };
    }
    case types.DELETE_USER_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, 'アカウントを削除しました'],
      };
    }
    case types.DELETE_USER_FAIL: {
      return {
        snackbarQueue: [
          ...state.snackbarQueue,
          'アカウントの情報に失敗しました',
        ],
      };
    }
    case types.FETCH_MY_POSTS_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の取得に失敗しました'],
      };
    }
    case types.DELETE_MY_POSTS_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿を削除しました'],
      };
    }
    case types.DELETE_MY_POSTS_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の削除に失敗しました'],
      };
    }
    default:
      return state;
  }
};
