import { combineEpics, ofType, ActionsObservable } from 'redux-observable';
import { from, of } from 'rxjs';
import {
  catchError,
  filter,
  flatMap,
  map,
  mapTo,
  tap,
  switchMap,
} from 'rxjs/operators';
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
      types.SIGN_IN_WITH_EMAIL,
      types.SIGN_UP_WITH_EMAIL,
    ),
    mapTo({
      type: types.START_PROGRESS,
      payload: 'TODO_REMOVE_THIS',
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
    ),
    mapTo({
      type: types.FINISH_PROGRESS,
      payload: 'TODO_REMOVE_THIS',
    }),
  );

export const redirectorEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(types.GET_OR_CREATE_USER_INFO_SUCCESS),
    filter(() => history.location.pathname === '/auth'),
    map(() => {
      history.push('/all-map');
      return { type: types.USER_REDIRECTED };
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
