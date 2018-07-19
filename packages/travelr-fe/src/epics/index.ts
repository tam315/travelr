import { ActionsObservable, combineEpics, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, flatMap, map, mapTo } from 'rxjs/operators';
import wretch from 'wretch';
import types from '../actions/types';
import config from '../config';
import firebaseUtils from '../utils/firebaseUtils';
import history from '../utils/history';

export const initAuthEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(types.INIT_AUTH),
    // flatMap converts a Promise to the Observable
    flatMap(async () => {
      const redirectedUserAuthSeed = await firebaseUtils.getRedirectedUserAuthSeed();
      const currentUserAuthSeed = await firebaseUtils.getCurrentUserAuthSeed();

      // if the user is redirected and has the credential
      if (redirectedUserAuthSeed) {
        return {
          type: types.INIT_AUTH_USER_HAS_CREDENTIAL,
          payload: redirectedUserAuthSeed,
        };
      }

      // if the user already has the credential
      if (currentUserAuthSeed) {
        return {
          type: types.INIT_AUTH_USER_HAS_CREDENTIAL,
          payload: currentUserAuthSeed,
        };
      }

      // if the user doesn't have token
      return { type: types.INIT_AUTH_USER_HAS_NO_CREDENTIAL };
    }),
    catchError(() =>
      of({
        type: types.INIT_AUTH_FAIL,
      }),
    ),
  );

export const getOrCreateUserInfoEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(
      types.INIT_AUTH_USER_HAS_CREDENTIAL,
      types.SIGN_IN_WITH_EMAIL_SUCCESS,
      types.SIGN_UP_WITH_EMAIL_SUCCESS,
    ),
    flatMap(action => {
      // @ts-ignore
      const { token, displayName, emailVerified } = action.payload;

      const request = wretch(`${config.apiUrl}users`)
        .headers({ authorization: token })
        .post({ displayName })
        .json();

      return from(request).pipe(
        map(userInfo => ({
          type: types.GET_OR_CREATE_USER_INFO_SUCCESS,
          payload: { ...userInfo, token, emailVerified },
        })),
        catchError(() => {
          return of({
            type: types.GET_OR_CREATE_USER_INFO_FAIL,
          });
        }),
      );
    }),
  );

export const startProgressServiceEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(
      types.INIT_AUTH,
      types.GET_OR_CREATE_USER_INFO,
      types.SIGN_IN_WITH_GOOGLE,
      types.SIGN_IN_WITH_FACEBOOK,
      types.SIGN_IN_WITH_EMAIL,
      types.SIGN_UP_WITH_EMAIL,
      types.SEND_EMAIL_VERIFICATION,
      types.SEND_PASSWORD_RESET_EMAIL,
      types.CREATE_POST,
      types.EDIT_POST,
    ),
    mapTo({
      type: types.START_PROGRESS,
    }),
  );

export const stopProgressServiceEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(
      types.INIT_AUTH_USER_HAS_CREDENTIAL,
      types.INIT_AUTH_USER_HAS_NO_CREDENTIAL,
      types.INIT_AUTH_FAIL,
      types.GET_OR_CREATE_USER_INFO_SUCCESS,
      types.GET_OR_CREATE_USER_INFO_FAIL,
      types.SIGN_IN_WITH_EMAIL_SUCCESS,
      types.SIGN_IN_WITH_EMAIL_FAIL,
      types.SIGN_UP_WITH_EMAIL_SUCCESS,
      types.SIGN_UP_WITH_EMAIL_FAIL,
      types.SEND_EMAIL_VERIFICATION_SUCCESS,
      types.SEND_EMAIL_VERIFICATION_FAIL,
      types.SEND_PASSWORD_RESET_EMAIL_SUCCESS,
      types.SEND_PASSWORD_RESET_EMAIL_FAIL,
      types.CREATE_POST_SUCCESS,
      types.CREATE_POST_FAIL,
      types.EDIT_POST_SUCCESS,
      types.EDIT_POST_FAIL,
    ),
    mapTo({
      type: types.FINISH_PROGRESS,
    }),
  );

export const redirectorEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(
      types.GET_OR_CREATE_USER_INFO_SUCCESS,
      types.DELETE_USER_SUCCESS,
      types.SIGN_OUT_USER_SUCCESS,
      types.CREATE_POST_SUCCESS,
      types.EDIT_POST_SUCCESS,
      types.DELETE_POST_SUCCESS,
    ),
    map(action => {
      switch (action.type) {
        case types.GET_OR_CREATE_USER_INFO_SUCCESS:
          if (history.location.pathname === '/auth') history.push('/all-map');
          break;
        case types.DELETE_USER_SUCCESS:
          history.push('/');
          break;
        case types.SIGN_OUT_USER_SUCCESS:
          history.push('/');
          break;
        case types.CREATE_POST_SUCCESS:
          history.push(`/post/${action.payload}`);
          break;
        case types.EDIT_POST_SUCCESS:
          history.push(`/post/${action.payload}`);
          break;
        case types.DELETE_POST_SUCCESS:
          history.push('/account/posts');
          break;
      }

      return { type: types.USER_REDIRECTED };
    }),
  );

export const snackbarEpic = (action$: ActionsObservable<any>) => {
  // helper to create actions to display snackbar
  const s = message => ({
    type: types.ADD_SNACKBAR_QUEUE,
    payload: message,
  });

  const errCodeAndMessagePairs = {
    'auth/account-exists-with-different-credential': s(
      'このメールアドレスは別のログイン方法に紐づけされています',
    ),
    'auth/email-already-in-use': s('このメールアドレスは既に使用されています'),
    'auth/invalid-email': s('メールアドレスの形式が正しくありません'),
    'auth/user-not-found': s('このメールアドレスは登録されていません'),
    'auth/weak-password': s('パスワードは6文字以上必要です'),
    'auth/wrong-password': s(
      'パスワードが間違っているか、メールアドレスがほかのログイン方法に紐付けされています。',
    ),
    'storage/unauthorized': s(
      'メール認証が完了していません。アカウント管理画面からメール認証を行ってください。',
    ),
  };

  const actionAndMessagePairs = {
    [types.INIT_AUTH_FAIL]: s('認証情報の取得に失敗しました'),

    [types.GET_OR_CREATE_USER_INFO_FAIL]: s(
      'ユーザ情報の作成または取得に失敗しました',
    ),

    [types.UPDATE_USER_INFO_SUCCESS]: s('ユーザ情報を更新しました'),
    [types.UPDATE_USER_INFO_FAIL]: s('ユーザ情報の更新に失敗しました'),

    [types.DELETE_USER_SUCCESS]: s('アカウントを削除しました'),
    [types.DELETE_USER_FAIL]: s('アカウントの情報に失敗しました'),

    [types.SIGN_IN_WITH_EMAIL_FAIL]: s('サインインに失敗しました'),

    [types.SIGN_UP_WITH_EMAIL_SUCCESS]: s(
      'アカウントを作成しました。メールボックスを確認して、認証を完了させてください。',
    ),
    [types.SIGN_UP_WITH_EMAIL_FAIL]: s('アカウントの作成に失敗しました'),

    [types.SEND_EMAIL_VERIFICATION_SUCCESS]: s('認証メールを再送しました'),
    [types.SEND_EMAIL_VERIFICATION_FAIL]: s('認証メールの再送に失敗しました'),

    [types.SEND_PASSWORD_RESET_EMAIL_SUCCESS]: s(
      'パスワードリセットのメールを送信しました',
    ),
    [types.SEND_PASSWORD_RESET_EMAIL_FAIL]: s(
      'パスワードリセットのメール送信に失敗しました',
    ),

    [types.SIGN_OUT_USER_SUCCESS]: s('サインアウトしました'),
    [types.SIGN_OUT_USER_FAIL]: s('サインアウトに失敗しました'),

    [types.FETCH_ALL_POSTS_FAIL]: s('投稿の取得に失敗しました'),

    [types.FETCH_POST_FAIL]: s('投稿の取得に失敗しました'),

    [types.CREATE_POST_SUCCESS]: s('投稿を作成しました'),
    [types.CREATE_POST_FAIL]: s('投稿の作成に失敗しました'),

    [types.EDIT_POST_SUCCESS]: s('投稿を編集しました'),
    [types.EDIT_POST_FAIL]: s('投稿の編集に失敗しました'),

    [types.FETCH_MY_POSTS_FAIL]: s('投稿の取得に失敗しました'),

    [types.DELETE_POST_SUCCESS]: s('投稿を削除しました'),
    [types.DELETE_POST_FAIL]: s('投稿の削除に失敗しました'),

    [types.DELETE_POSTS_SUCCESS]: s('投稿を削除しました'),
    [types.DELETE_POSTS_FAIL]: s('投稿の削除に失敗しました'),

    [types.CREATE_COMMENT_SUCCESS]: s('コメントを投稿しました'),
    [types.CREATE_COMMENT_FAIL]: s('コメントの投稿に失敗しました'),

    [types.DELETE_COMMENT_SUCCESS]: s('コメントを削除しました'),
    [types.DELETE_COMMENT_FAIL]: s('コメントの削除に失敗しました'),

    [types.TOGGLE_LIKE_FAIL]: s('いいねの変更に失敗しました'),
  };

  const actionNameArray = Object.keys(actionAndMessagePairs);

  return action$.pipe(
    ofType(...actionNameArray),
    map(action => {
      // display more specific error messages if 'err.code'(from firebase SDK) is provided
      const err = action.payload;
      if (err && err.code) {
        return (
          errCodeAndMessagePairs[err.code] || {
            type: types.ADD_SNACKBAR_QUEUE,
            payload: '不明なエラーが発生しました',
          }
        );
      }
      // otherwise show generic message
      return actionAndMessagePairs[action.type];
    }),
  );
};

export default combineEpics(
  getOrCreateUserInfoEpic,
  initAuthEpic,
  startProgressServiceEpic,
  stopProgressServiceEpic,
  redirectorEpic,
  snackbarEpic,
);
