import { Lokka } from 'lokka';
import Transport from 'lokka-transport-http';
import {
  ActionsObservable,
  combineEpics,
  ofType,
  StateObservable,
} from 'redux-observable';
import { merge, of } from 'rxjs';
import { catchError, flatMap, map, mapTo, switchMap } from 'rxjs/operators';
import wretch from 'wretch';
import types from '../actions/types';
// @ts-ignore
import config from '../config';
import { Store } from '../config/types';
import GetPostQuery from '../queries/getPost';
import GetPostsQuery from '../queries/getPosts';
import firebaseUtils from '../utils/firebaseUtils';
import { flattenCriterion } from '../utils/general';
import history from '../utils/history';
import { getPositionFromPlaceName } from '../utils/mapsUtils';

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
    catchError(err =>
      of({
        type: types.INIT_AUTH_FAIL,
        payload: err,
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
    flatMap(async action => {
      // @ts-ignore
      const { token, displayName, emailVerified } = action.payload;

      const userInfo = await wretch(`${config.apiUrl}users`)
        .headers({ authorization: token })
        .post({ displayName })
        .json();

      return {
        type: types.GET_OR_CREATE_USER_INFO_SUCCESS,
        payload: { ...userInfo, token, emailVerified },
      };
    }),
    catchError(err =>
      of({
        type: types.GET_OR_CREATE_USER_INFO_FAIL,
        payload: err,
      }),
    ),
  );

export const fetchAllPostsEpic = (
  action$: ActionsObservable<any>,
  state$: StateObservable<Store>,
) =>
  action$.pipe(
    // prettier-ignore
    ofType(
      types.FETCH_ALL_POSTS,
      types.CHANGE_FILTER_CRITERION_SUCCESS,
      types.CLEAR_FILTER_CRITERION_SUCCESS,
      types.CREATE_POST_SUCCESS,
      types.EDIT_POST_SUCCESS,
      types.DELETE_POST_SUCCESS,
      types.DELETE_POSTS_SUCCESS,
    ),
    switchMap(async () => {
      const criterion = await flattenCriterion(state$.value.filter.criterion);

      const client = new Lokka({
        transport: new Transport(`${config.apiUrl}graphql`, {
          credentials: false,
        }),
      });

      const { posts } = await client.query(GetPostsQuery, criterion);

      return {
        type: types.FETCH_ALL_POSTS_SUCCESS,
        payload: posts,
      };
    }),
    catchError(err =>
      of({
        type: types.FETCH_ALL_POSTS_FAIL,
        payload: err,
      }),
    ),
  );

export const fetchPostEpic = (
  action$: ActionsObservable<any>,
  state$: StateObservable<Store>,
) =>
  action$.pipe(
    ofType(
      types.FETCH_POST,
      types.CREATE_COMMENT_SUCCESS,
      types.DELETE_COMMENT_SUCCESS,
      types.TOGGLE_LIKE_SUCCESS,
    ),
    flatMap(async action => {
      const postId = action.payload;
      const { user } = state$.value;

      const client = new Lokka({
        transport: new Transport(`${config.apiUrl}graphql`, {
          credentials: false,
        }),
      });

      const variables = {
        postId,
        userId: user.userId,
      };

      const { post } = await client.query(GetPostQuery, variables);

      return {
        type: types.FETCH_POST_SUCCESS,
        payload: post,
      };
    }),
    catchError(err =>
      of({
        type: types.FETCH_POST_FAIL,
        payload: err,
      }),
    ),
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
      types.FETCH_ALL_POSTS,
      types.CREATE_POST,
      types.EDIT_POST,
    ),
    map(action => ({
      type: types.START_PROGRESS,
      payload: action.type,
    })),
  );

export const stopProgressServiceEpic = (action$: ActionsObservable<any>) =>
  // prettier-ignore
  merge(
    action$.pipe(
      ofType(
        types.INIT_AUTH_USER_HAS_CREDENTIAL,
        types.INIT_AUTH_USER_HAS_NO_CREDENTIAL,
        types.INIT_AUTH_FAIL,
      ),
      mapTo(types.INIT_AUTH),
    ),
    action$.pipe(
      ofType(
        types.GET_OR_CREATE_USER_INFO_SUCCESS,
        types.GET_OR_CREATE_USER_INFO_FAIL,
      ),
      mapTo(types.GET_OR_CREATE_USER_INFO),
    ),
    action$.pipe(
      ofType(
        types.SIGN_IN_WITH_EMAIL_SUCCESS,
        types.SIGN_IN_WITH_EMAIL_FAIL,
      ),
      mapTo(types.SIGN_IN_WITH_EMAIL),
    ),
    action$.pipe(
      ofType(
        types.SIGN_UP_WITH_EMAIL_SUCCESS,
        types.SIGN_UP_WITH_EMAIL_FAIL,
      ),
      mapTo(types.SIGN_UP_WITH_EMAIL),
    ),
    action$.pipe(
      ofType(
        types.SEND_EMAIL_VERIFICATION_SUCCESS,
        types.SEND_EMAIL_VERIFICATION_FAIL,
      ),
      mapTo(types.SEND_EMAIL_VERIFICATION),
    ),
    action$.pipe(
      ofType(
        types.SEND_PASSWORD_RESET_EMAIL_SUCCESS,
        types.SEND_PASSWORD_RESET_EMAIL_FAIL,
      ),
      mapTo(types.SEND_PASSWORD_RESET_EMAIL),
    ),
    action$.pipe(
      ofType(
        types.FETCH_ALL_POSTS_SUCCESS,
        types.FETCH_ALL_POSTS_FAIL,
      ),
      mapTo(types.FETCH_ALL_POSTS),
    ),
    action$.pipe(
      ofType(
        types.CREATE_POST_SUCCESS,
        types.CREATE_POST_FAIL,
      ),
      mapTo(types.CREATE_POST),
    ),
    action$.pipe(
      ofType(
        types.EDIT_POST_SUCCESS,
        types.EDIT_POST_FAIL,
      ),
      mapTo(types.EDIT_POST),
    ),
  ).pipe(
    map(payload => ({
      payload,
      type: types.FINISH_PROGRESS,
    })),
  );

export const mapZoomAndCenterUpdaterEpic = (
  action$: ActionsObservable<any>,
  state$: StateObservable<Store>,
) =>
  action$.pipe(
    ofType(types.CHANGE_FILTER_CRITERION_SUCCESS),
    flatMap(async () => {
      const { placeName, radius } = state$.value.filter.criterion;

      if (!placeName) return { type: 'NOOP' };

      const { lat, lng } = await getPositionFromPlaceName(placeName);

      if (!lat || !lng || !radius) return { type: 'NOOP' };

      return {
        type: types.UPDATE_MAP_ZOOM_AND_CENTER_SUCCESS,
        payload: { lat, lng, radius },
      };
    }),
    catchError(err =>
      of({
        type: types.UPDATE_MAP_ZOOM_AND_CENTER_FAIL,
        payload: err,
      }),
    ),
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
          if (history.location.pathname === '/auth') history.push('/all-grid');
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
  // prettier-ignore
  const errCodeAndMessagePairs = {
    'auth/account-exists-with-different-credential': 'このメールアドレスは別のログイン方法に紐づけされています',
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
    'auth/invalid-email': 'メールアドレスの形式が正しくありません',
    'auth/user-not-found': 'このメールアドレスは登録されていません',
    'auth/weak-password': 'パスワードは6文字以上必要です',
    'auth/wrong-password': 'パスワードが間違っているか、メールアドレスがほかのログイン方法に紐付けされています。',
    'storage/unauthorized': 'メール認証が完了していません。アカウント管理画面からメール認証を行ってください。',
  };

  // prettier-ignore
  const actionAndMessagePairs = {
    [types.INIT_AUTH_FAIL]: '認証情報の取得に失敗しました',
    [types.GET_OR_CREATE_USER_INFO_FAIL]: 'ユーザ情報の作成または取得に失敗しました',

    [types.UPDATE_USER_INFO_SUCCESS]: 'ユーザ情報を更新しました',
    [types.UPDATE_USER_INFO_FAIL]: 'ユーザ情報の更新に失敗しました',

    [types.DELETE_USER_SUCCESS]: 'アカウントを削除しました',
    [types.DELETE_USER_FAIL]: 'アカウントの情報に失敗しました',

    [types.SIGN_IN_WITH_EMAIL_FAIL]: 'サインインに失敗しました',

    [types.SIGN_UP_WITH_EMAIL_SUCCESS]: 'アカウントを作成しました。メールボックスを確認して、認証を完了させてください。',
    [types.SIGN_UP_WITH_EMAIL_FAIL]: 'アカウントの作成に失敗しました',

    [types.SEND_EMAIL_VERIFICATION_SUCCESS]: '認証メールを再送しました',
    [types.SEND_EMAIL_VERIFICATION_FAIL]: '認証メールの再送に失敗しました',

    [types.SEND_PASSWORD_RESET_EMAIL_SUCCESS]: 'パスワードリセットのメールを送信しました',
    [types.SEND_PASSWORD_RESET_EMAIL_FAIL]: 'パスワードリセットのメール送信に失敗しました',

    [types.SIGN_OUT_USER_SUCCESS]: 'サインアウトしました',
    [types.SIGN_OUT_USER_FAIL]: 'サインアウトに失敗しました',

    [types.FETCH_ALL_POSTS_FAIL]: '投稿の取得に失敗しました',

    [types.FETCH_POST_FAIL]: '投稿の取得に失敗しました',

    [types.CREATE_POST]: '画像をアップロード中です。しばらくお待ち下さい。',
    [types.CREATE_POST_SUCCESS]: '投稿を作成しました。画像の生成に15秒程度かかります。',
    [types.CREATE_POST_FAIL]: '投稿の作成に失敗しました',

    [types.EDIT_POST_SUCCESS]: '投稿を編集しました',
    [types.EDIT_POST_FAIL]: '投稿の編集に失敗しました',

    [types.FETCH_MY_POSTS_FAIL]: '投稿の取得に失敗しました',

    [types.DELETE_POST_SUCCESS]: '投稿を削除しました',
    [types.DELETE_POST_FAIL]: '投稿の削除に失敗しました',

    [types.DELETE_POSTS_SUCCESS]: '投稿を削除しました',
    [types.DELETE_POSTS_FAIL]: '投稿の削除に失敗しました',

    [types.CREATE_COMMENT_SUCCESS]: 'コメントを投稿しました',
    [types.CREATE_COMMENT_FAIL]: 'コメントの投稿に失敗しました',

    [types.DELETE_COMMENT_SUCCESS]: 'コメントを削除しました',
    [types.DELETE_COMMENT_FAIL]: 'コメントの削除に失敗しました',

    [types.TOGGLE_LIKE_FAIL]: 'いいねの変更に失敗しました',
  };

  const actionNameArray = Object.keys(actionAndMessagePairs);

  return action$.pipe(
    ofType(...actionNameArray),
    map(action => {
      const err = action.payload;

      // if user is trying to do some task that needs the authorization
      if (
        (action.type === types.TOGGLE_LIKE_FAIL ||
          action.type === types.CREATE_COMMENT_FAIL) &&
        err &&
        err.message === "missing 'authorization' header"
      ) {
        return 'この操作を行うためにはサインインが必要です';
      }

      // display more specific error messages if 'err.code'(from firebase SDK) is provided
      if (err && err.code) {
        return errCodeAndMessagePairs[err.code] || '不明なエラーが発生しました';
      }

      // otherwise show generic message
      return actionAndMessagePairs[action.type];
    }),
    map(message => ({
      type: types.ADD_SNACKBAR_QUEUE,
      payload: message,
    })),
  );
};

export default combineEpics(
  getOrCreateUserInfoEpic,
  initAuthEpic,
  fetchAllPostsEpic,
  fetchPostEpic,
  startProgressServiceEpic,
  stopProgressServiceEpic,
  mapZoomAndCenterUpdaterEpic,
  redirectorEpic,
  snackbarEpic,
);
