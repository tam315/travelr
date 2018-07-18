import { combineEpics, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, flatMap, map, mapTo } from 'rxjs/operators';
import actionTypes from '../actions/types';
import config from '../config';
import firebaseUtils from '../utils/firebaseUtils';
import history from '../utils/history';

export const initAuthEpic = action$ =>
  action$.pipe(
    ofType(actionTypes.INIT_AUTH),
    // flatMap converts a Promise to the Observable
    flatMap(async () => {
      const redirectedUserAuthSeed = await firebaseUtils.getRedirectedUserAuthSeed();
      const currentUserAuthSeed = await firebaseUtils.getCurrentUserAuthSeed();

      // if the user is redirected and has the credential
      if (redirectedUserAuthSeed) {
        return {
          type: actionTypes.INIT_AUTH_USER_HAS_CREDENTIAL,
          payload: redirectedUserAuthSeed,
        };
      }

      // if the user already has the credential
      if (currentUserAuthSeed) {
        return {
          type: actionTypes.INIT_AUTH_USER_HAS_CREDENTIAL,
          payload: currentUserAuthSeed,
        };
      }

      // if the user doesn't have token
      return { type: actionTypes.INIT_AUTH_USER_HAS_NO_CREDENTIAL };
    }),
    catchError(() =>
      of({
        type: actionTypes.INIT_AUTH_FAIL,
      }),
    ),
  );

export const getOrCreateUserInfoEpic = action$ =>
  action$.pipe(
    ofType(
      actionTypes.INIT_AUTH_USER_HAS_CREDENTIAL,
      actionTypes.SIGN_IN_WITH_EMAIL_SUCCESS,
      actionTypes.SIGN_UP_WITH_EMAIL_SUCCESS,
    ),
    flatMap(action => {
      // @ts-ignore
      const { token, displayName, emailVerified } = action.payload;

      const fetchOptions = {
        method: 'POST',
        headers: {
          authorization: token,
        },
        body: displayName ? JSON.stringify({ displayName }) : '',
      };

      return from(fetch(`${config.apiUrl}users`, fetchOptions)).pipe(
        flatMap(res => {
          if (!res.ok) throw 'response is not ok';
          return res.json();
        }),
        map(userInfo => ({
          type: actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS,
          payload: { ...userInfo, token, emailVerified },
        })),
      );
    }),
    catchError(() => {
      return of({
        type: actionTypes.GET_OR_CREATE_USER_INFO_FAIL,
      });
    }),
  );

export const startProgressServiceEpic = action$ =>
  action$.pipe(
    ofType(
      actionTypes.INIT_AUTH,
      actionTypes.GET_OR_CREATE_USER_INFO,
      actionTypes.SIGN_IN_WITH_EMAIL,
      actionTypes.SIGN_UP_WITH_EMAIL,
    ),
    mapTo({
      type: actionTypes.START_PROGRESS,
      payload: 'TODO_REMOVE_THIS',
    }),
  );

export const stopProgressServiceEpic = action$ =>
  action$.pipe(
    ofType(
      actionTypes.INIT_AUTH_USER_HAS_CREDENTIAL,
      actionTypes.INIT_AUTH_USER_HAS_NO_CREDENTIAL,
      actionTypes.INIT_AUTH_FAIL,
      actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS,
      actionTypes.GET_OR_CREATE_USER_INFO_FAIL,
      actionTypes.SIGN_IN_WITH_EMAIL_SUCCESS,
      actionTypes.SIGN_IN_WITH_EMAIL_FAIL,
      actionTypes.SIGN_UP_WITH_EMAIL_SUCCESS,
      actionTypes.SIGN_UP_WITH_EMAIL_FAIL,
    ),
    mapTo({
      type: actionTypes.FINISH_PROGRESS,
      payload: 'TODO_REMOVE_THIS',
    }),
  );

export const redirectorEpic = action$ =>
  action$.pipe(
    ofType(actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS),
    filter(() => history.location.pathname === '/auth'),
    map(() => {
      history.push('/all-map');
      return { type: actionTypes.USER_REDIRECTED };
    }),
  );

export const snackbarEpic = action$ =>
  action$.pipe(
    ofType(
      actionTypes.INIT_AUTH_FAIL,
      actionTypes.GET_OR_CREATE_USER_INFO_FAIL,
      actionTypes.SIGN_UP_WITH_EMAIL_SUCCESS,
    ),
    map(action => {
      // @ts-ignore
      switch (action.type) {
        case actionTypes.INIT_AUTH_FAIL:
          return {
            type: actionTypes.ADD_SNACKBAR_QUEUE,
            payload: '認証情報の取得に失敗しました',
          };
        case actionTypes.GET_OR_CREATE_USER_INFO_FAIL:
          return {
            type: actionTypes.ADD_SNACKBAR_QUEUE,
            payload: 'ユーザ情報の作成または取得に失敗しました',
          };
        case actionTypes.SIGN_UP_WITH_EMAIL_SUCCESS:
          return {
            type: actionTypes.ADD_SNACKBAR_QUEUE,
            payload:
              'アカウントを作成しました。メールボックスを確認して、認証を完了させてください。',
          };
      }
    }),
  );

export default combineEpics(
  getOrCreateUserInfoEpic,
  initAuthEpic,
  startProgressServiceEpic,
  stopProgressServiceEpic,
  redirectorEpic,
  snackbarEpic,
);
