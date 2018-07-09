// @flow
import appReducer from '../appReducer';
import types from '../../actions/types';

describe('appReducer', () => {
  test('REDUCE_SNACKBAR_QUEUE', () => {
    const state = {
      snackbarQueue: ['message1', 'message2', 'message3'],
    };

    const action = {
      type: types.REDUCE_SNACKBAR_QUEUE,
    };

    const expected = {
      snackbarQueue: ['message2', 'message3'],
    };

    expect(appReducer(state, action)).toEqual(expected);
  });

  test('ADD_SNACKBAR_QUEUE', () => {
    const state = {
      snackbarQueue: ['message1', 'message2', 'message3'],
    };

    const action = {
      type: types.ADD_SNACKBAR_QUEUE,
      payload: 'message4',
    };

    const expected = {
      snackbarQueue: ['message1', 'message2', 'message3', 'message4'],
    };

    expect(appReducer(state, action)).toEqual(expected);
  });

  test('show messages', () => {
    const state = {
      snackbarQueue: ['message1', 'message2', 'message3'],
    };

    const actionNamesAndExpectedMessages = [
      [
        'GET_OR_CREATE_USER_INFO_FAIL',
        'ユーザ情報の取得または作成に失敗しました',
      ],
      ['FETCH_USER_INFO_FAIL', 'ユーザ情報の取得に失敗しました'],
      ['UPDATE_USER_INFO_SUCCESS', 'ユーザ情報を更新しました'],
      ['UPDATE_USER_INFO_FAIL', 'ユーザ情報の更新に失敗しました'],
      ['DELETE_USER_SUCCESS', 'アカウントを削除しました'],
      ['DELETE_USER_FAIL', 'アカウントの情報に失敗しました'],
      ['SIGN_OUT_USER_SUCCESS', 'サインアウトしました'],
      ['SIGN_OUT_USER_FAIL', 'サインアウトに失敗しました'],
      ['FETCH_ALL_POSTS_FAIL', '投稿の取得に失敗しました'],
      ['FETCH_POST_FAIL', '投稿の取得に失敗しました'],
      ['CREATE_POST_SUCCESS', '投稿を作成しました'],
      ['CREATE_POST_FAIL', '投稿の作成に失敗しました'],
      ['EDIT_POST_SUCCESS', '投稿を編集しました'],
      ['EDIT_POST_FAIL', '投稿の編集に失敗しました'],
      ['FETCH_MY_POSTS_FAIL', '投稿の取得に失敗しました'],
      ['DELETE_POST_SUCCESS', '投稿を削除しました'],
      ['DELETE_POST_FAIL', '投稿の削除に失敗しました'],
      ['DELETE_POSTS_SUCCESS', '投稿を削除しました'],
      ['DELETE_POSTS_FAIL', '投稿の削除に失敗しました'],
      ['CREATE_COMMENT_SUCCESS', 'コメントを投稿しました'],
      ['CREATE_COMMENT_FAIL', 'コメントの投稿に失敗しました'],
      ['DELETE_COMMENT_SUCCESS', 'コメントを削除しました'],
      ['DELETE_COMMENT_FAIL', 'コメントの削除に失敗しました'],
      ['TOGGLE_LIKE_FAIL', 'いいねの変更に失敗しました'],
    ];

    actionNamesAndExpectedMessages.forEach(([actionName, expectedMessage]) => {
      const action = {
        type: types[actionName],
      };

      const expected = {
        snackbarQueue: [...state.snackbarQueue, expectedMessage],
      };

      expect(appReducer(state, action)).toEqual(expected);
    });
  });
});
