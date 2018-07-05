// @flow
import actionTypes from '../actions/types';
import type { AppStore } from '../config/types';

const INITIAL_STATE = {
  snackbarQueue: [],
};

export default (state: AppStore = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case actionTypes.REDUCE_SNACKBAR_QUEUE: {
      const newState = { ...state };
      newState.snackbarQueue.shift();
      return newState;
    }
    case actionTypes.FETCH_USER_INFO_FAIL: {
      return {
        snackbarQueue: [
          ...state.snackbarQueue,
          'ユーザ情報の取得に失敗しました',
        ],
      };
    }
    case actionTypes.UPDATE_USER_INFO_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, 'ユーザ情報を更新しました'],
      };
    }
    case actionTypes.UPDATE_USER_INFO_FAIL: {
      return {
        snackbarQueue: [
          ...state.snackbarQueue,
          'ユーザ情報の更新に失敗しました',
        ],
      };
    }
    case actionTypes.DELETE_USER_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, 'アカウントを削除しました'],
      };
    }
    case actionTypes.DELETE_USER_FAIL: {
      return {
        snackbarQueue: [
          ...state.snackbarQueue,
          'アカウントの情報に失敗しました',
        ],
      };
    }
    case actionTypes.FETCH_ALL_POSTS_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の取得に失敗しました'],
      };
    }
    case actionTypes.FETCH_POST_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の取得に失敗しました'],
      };
    }
    case actionTypes.CREATE_POST_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿を作成しました'],
      };
    }
    case actionTypes.CREATE_POST_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の作成に失敗しました'],
      };
    }
    case actionTypes.EDIT_POST_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿を編集しました'],
      };
    }
    case actionTypes.EDIT_POST_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の編集に失敗しました'],
      };
    }
    case actionTypes.FETCH_MY_POSTS_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の取得に失敗しました'],
      };
    }
    case actionTypes.DELETE_POST_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿を削除しました'],
      };
    }
    case actionTypes.DELETE_POST_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の削除に失敗しました'],
      };
    }
    case actionTypes.DELETE_POSTS_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿を削除しました'],
      };
    }
    case actionTypes.DELETE_POSTS_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, '投稿の削除に失敗しました'],
      };
    }
    case actionTypes.CREATE_COMMENT_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, 'コメントを投稿しました'],
      };
    }
    case actionTypes.CREATE_COMMENT_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, 'コメントの投稿に失敗しました'],
      };
    }
    case actionTypes.DELETE_COMMENT_SUCCESS: {
      return {
        snackbarQueue: [...state.snackbarQueue, 'コメントを削除しました'],
      };
    }
    case actionTypes.DELETE_COMMENT_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, 'コメントの削除に失敗しました'],
      };
    }
    case actionTypes.TOGGLE_LIKE_FAIL: {
      return {
        snackbarQueue: [...state.snackbarQueue, 'いいねの変更に失敗しました'],
      };
    }
    default:
      return state;
  }
};
