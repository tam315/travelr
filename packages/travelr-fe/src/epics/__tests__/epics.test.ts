import { from, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  getOrCreateUserInfoEpic,
  initAuthEpic,
  redirectorEpic,
  snackbarEpic,
  startProgressServiceEpic,
  stopProgressServiceEpic,
} from '../';
import actionTypes from '../../actions/types';
import { DUMMY_USER_STORE } from '../../config/dummies';
import { AuthSeed } from '../../config/types';
import firebaseUtils from '../../utils/firebaseUtils';
import history from '../../utils/history';

declare const fetch: any;

jest.mock('../../utils/firebaseUtils');
jest.mock('../../utils/history');

type ActionsAndResults = {
  marbles: string;
  values: object;
};

const epicTestUtil = (
  epic,
  actions: ActionsAndResults,
  results: ActionsAndResults,
) => {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  testScheduler.run(({ hot, cold, expectObservable }) => {
    const action$ = cold(actions.marbles, actions.values);
    const output$ = epic(action$);
    expectObservable(output$).toBe(results.marbles, results.values);
  });
};

describe('initAuthEpic', () => {
  const assertionExecuted = jest.fn();
  const authSeed: AuthSeed = {
    token: 'token',
    displayName: 'displayName',
    emailVerified: true,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('if the user is redirected and has the credential', done => {
    firebaseUtils.getRedirectedUserAuthSeed = jest
      .fn()
      .mockResolvedValue(authSeed);
    firebaseUtils.getCurrentUserAuthSeed = jest.fn().mockResolvedValue(null);

    const incomingAction = {
      type: actionTypes.INIT_AUTH,
    };

    // @ts-ignore
    initAuthEpic(of(incomingAction)).subscribe(
      outcomingAction => {
        expect(outcomingAction).toEqual({
          type: actionTypes.INIT_AUTH_USER_HAS_CREDENTIAL,
          payload: authSeed,
        });
        assertionExecuted();
      },
      null,
      () => {
        expect(assertionExecuted).toHaveBeenCalledTimes(1);
        done();
      },
    );
  });

  test('if the user already has the credential', done => {
    firebaseUtils.getRedirectedUserAuthSeed = jest.fn().mockResolvedValue(null);
    firebaseUtils.getCurrentUserAuthSeed = jest
      .fn()
      .mockResolvedValue(authSeed);

    const incomingAction = {
      type: actionTypes.INIT_AUTH,
    };

    // @ts-ignore
    initAuthEpic(of(incomingAction)).subscribe(
      outcomingAction => {
        expect(outcomingAction).toEqual({
          type: actionTypes.INIT_AUTH_USER_HAS_CREDENTIAL,
          payload: authSeed,
        });
        assertionExecuted();
      },
      null,
      () => {
        expect(assertionExecuted).toHaveBeenCalledTimes(1);
        done();
      },
    );
  });

  test("if the user doesn't have token'", done => {
    firebaseUtils.getRedirectedUserAuthSeed = jest.fn().mockResolvedValue(null);
    firebaseUtils.getCurrentUserAuthSeed = jest.fn().mockResolvedValue(null);

    const incomingAction = {
      type: actionTypes.INIT_AUTH,
    };

    // @ts-ignore
    initAuthEpic(of(incomingAction)).subscribe(
      outcomingAction => {
        expect(outcomingAction).toEqual({
          type: actionTypes.INIT_AUTH_USER_HAS_NO_CREDENTIAL,
        });
        assertionExecuted();
      },
      null,
      () => {
        expect(assertionExecuted).toHaveBeenCalledTimes(1);
        done();
      },
    );
  });

  test("throw error when failure'", done => {
    firebaseUtils.getRedirectedUserAuthSeed = jest.fn().mockRejectedValue(null);
    firebaseUtils.getCurrentUserAuthSeed = jest.fn().mockRejectedValue(null);

    const incomingAction = {
      type: actionTypes.INIT_AUTH,
    };

    // @ts-ignore
    initAuthEpic(of(incomingAction)).subscribe(
      outcomingAction => {
        expect(outcomingAction).toEqual({
          type: actionTypes.INIT_AUTH_FAIL,
        });
        assertionExecuted();
      },
      null,
      () => {
        expect(assertionExecuted).toHaveBeenCalledTimes(1);
        done();
      },
    );
  });
});

describe('getOrCreateUserInfoEpic', () => {
  const DUMMY_TOKEN = DUMMY_USER_STORE.token;
  const DUMMY_DISPLAY_NAME = DUMMY_USER_STORE.displayName;

  const DUMMY_RESPONSE = { ...DUMMY_USER_STORE };
  delete DUMMY_RESPONSE.emailVerified;
  delete DUMMY_RESPONSE.token;

  const authSeed: AuthSeed = {
    token: DUMMY_TOKEN,
    displayName: DUMMY_DISPLAY_NAME,
    emailVerified: false,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('if success', done => {
    fetch.mockResponse(JSON.stringify(DUMMY_RESPONSE));

    const incomingActions = [
      {
        type: actionTypes.INIT_AUTH_USER_HAS_CREDENTIAL,
        payload: authSeed,
      },
      {
        type: actionTypes.SIGN_IN_WITH_EMAIL_SUCCESS,
        payload: authSeed,
      },
      {
        type: actionTypes.SIGN_UP_WITH_EMAIL_SUCCESS,
        payload: authSeed,
      },
    ];

    let assertionExecutedCount = 0;

    // @ts-ignore
    getOrCreateUserInfoEpic(from(incomingActions)).subscribe(
      outcomingAction => {
        const fetchUrl = fetch.mock.calls[assertionExecutedCount][0];
        const fetchOption = fetch.mock.calls[assertionExecutedCount][1];
        const body = JSON.parse(fetchOption.body);

        expect(fetchUrl).toContain('/users');
        expect(fetchOption.method).toContain('POST');
        expect(body).toEqual({ displayName: DUMMY_DISPLAY_NAME });

        expect(outcomingAction).toEqual({
          type: actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS,
          payload: {
            ...DUMMY_USER_STORE,
            token: DUMMY_TOKEN,
            emailVerified: false,
          },
        });
        assertionExecutedCount += 1;
      },
      null,
      () => {
        expect(assertionExecutedCount).toBe(3);
        done();
      },
    );
  });

  test('if fail', done => {
    fetch.mockReject();

    const incomingAction = {
      type: actionTypes.INIT_AUTH_USER_HAS_CREDENTIAL,
      payload: authSeed,
    };

    let assertionExecutedCount = 0;

    // @ts-ignore
    getOrCreateUserInfoEpic(of(incomingAction)).subscribe(
      outcomingAction => {
        expect(outcomingAction).toEqual({
          type: actionTypes.GET_OR_CREATE_USER_INFO_FAIL,
        });
        assertionExecutedCount += 1;
      },
      null,
      () => {
        expect(assertionExecutedCount).toBe(1);
        done();
      },
    );
  });
});

test('startProgressServiceEpic', () => {
  const actions = {
    marbles: '-a-',
    values: {
      a: { type: actionTypes.INIT_AUTH },
    },
  };

  const results = {
    marbles: '-a-',
    values: {
      a: {
        type: actionTypes.START_PROGRESS,
        payload: 'TODO_REMOVE_THIS',
      },
    },
  };

  epicTestUtil(startProgressServiceEpic, actions, results);
});

test('stopProgressServiceEpic', () => {
  const actions = {
    marbles: '-a-b-c-',
    values: {
      a: { type: actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS },
      b: { type: actionTypes.GET_OR_CREATE_USER_INFO_FAIL },
      c: { type: actionTypes.INIT_AUTH_USER_HAS_NO_CREDENTIAL },
    },
  };

  const results = {
    marbles: '-a-b-c-',
    values: {
      a: {
        type: actionTypes.FINISH_PROGRESS,
        payload: 'TODO_REMOVE_THIS',
      },
      b: {
        type: actionTypes.FINISH_PROGRESS,
        payload: 'TODO_REMOVE_THIS',
      },
      c: {
        type: actionTypes.FINISH_PROGRESS,
        payload: 'TODO_REMOVE_THIS',
      },
    },
  };

  epicTestUtil(stopProgressServiceEpic, actions, results);
});

test('redirectorEpic', () => {
  history.location.pathname = '/auth';

  const actions = {
    marbles: '-a-',
    values: {
      a: { type: actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS },
    },
  };

  const results = {
    marbles: '-a-',
    values: {
      a: {
        type: actionTypes.USER_REDIRECTED,
      },
    },
  };
  epicTestUtil(redirectorEpic, actions, results);
});

test('snackbarEpic', done => {
  const incomingActions = [
    {
      type: actionTypes.INIT_AUTH_FAIL,
      expectedMessage: '認証情報の取得に失敗しました',
    },
    {
      type: actionTypes.GET_OR_CREATE_USER_INFO_FAIL,
      expectedMessage: 'ユーザ情報の作成または取得に失敗しました',
    },
    {
      type: actionTypes.UPDATE_USER_INFO_SUCCESS,
      expectedMessage: 'ユーザ情報を更新しました',
    },
    {
      type: actionTypes.UPDATE_USER_INFO_FAIL,
      expectedMessage: 'ユーザ情報の更新に失敗しました',
    },
    {
      type: actionTypes.DELETE_USER_SUCCESS,
      expectedMessage: 'アカウントを削除しました',
    },
    {
      type: actionTypes.DELETE_USER_FAIL,
      expectedMessage: 'アカウントの情報に失敗しました',
    },
    {
      type: actionTypes.SIGN_UP_WITH_EMAIL_SUCCESS,
      expectedMessage:
        'アカウントを作成しました。メールボックスを確認して、認証を完了させてください。',
    },
    {
      type: actionTypes.SIGN_OUT_USER_SUCCESS,
      expectedMessage: 'サインアウトしました',
    },
    {
      type: actionTypes.SIGN_OUT_USER_FAIL,
      expectedMessage: 'サインアウトに失敗しました',
    },
    {
      type: actionTypes.FETCH_ALL_POSTS_FAIL,
      expectedMessage: '投稿の取得に失敗しました',
    },
    {
      type: actionTypes.FETCH_POST_FAIL,
      expectedMessage: '投稿の取得に失敗しました',
    },
    {
      type: actionTypes.CREATE_POST_SUCCESS,
      expectedMessage: '投稿を作成しました',
    },
    {
      type: actionTypes.CREATE_POST_FAIL,
      expectedMessage: '投稿の作成に失敗しました',
    },
    {
      type: actionTypes.EDIT_POST_SUCCESS,
      expectedMessage: '投稿を編集しました',
    },
    {
      type: actionTypes.EDIT_POST_FAIL,
      expectedMessage: '投稿の編集に失敗しました',
    },
    {
      type: actionTypes.FETCH_MY_POSTS_FAIL,
      expectedMessage: '投稿の取得に失敗しました',
    },
    {
      type: actionTypes.DELETE_POST_SUCCESS,
      expectedMessage: '投稿を削除しました',
    },
    {
      type: actionTypes.DELETE_POST_FAIL,
      expectedMessage: '投稿の削除に失敗しました',
    },
    {
      type: actionTypes.DELETE_POSTS_SUCCESS,
      expectedMessage: '投稿を削除しました',
    },
    {
      type: actionTypes.DELETE_POSTS_FAIL,
      expectedMessage: '投稿の削除に失敗しました',
    },
    {
      type: actionTypes.CREATE_COMMENT_SUCCESS,
      expectedMessage: 'コメントを投稿しました',
    },
    {
      type: actionTypes.CREATE_COMMENT_FAIL,
      expectedMessage: 'コメントの投稿に失敗しました',
    },
    {
      type: actionTypes.DELETE_COMMENT_SUCCESS,
      expectedMessage: 'コメントを削除しました',
    },
    {
      type: actionTypes.DELETE_COMMENT_FAIL,
      expectedMessage: 'コメントの削除に失敗しました',
    },
    {
      type: actionTypes.TOGGLE_LIKE_FAIL,
      expectedMessage: 'いいねの変更に失敗しました',
    },
  ];

  let assertionExecutedCount = 0;

  // @ts-ignore
  snackbarEpic(from(incomingActions)).subscribe(
    outcomingAction => {
      expect(outcomingAction.type).toEqual(actionTypes.ADD_SNACKBAR_QUEUE);
      expect(outcomingAction.payload).toEqual(
        incomingActions[assertionExecutedCount].expectedMessage,
      );
      assertionExecutedCount += 1;
    },
    null,
    () => {
      expect(assertionExecutedCount).toBe(incomingActions.length);
      done();
    },
  );
});
