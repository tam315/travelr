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

beforeEach(() => {
  jest.resetAllMocks();
});

describe('initAuthEpic', () => {
  const assertionExecuted = jest.fn();
  const authSeed: AuthSeed = {
    token: 'token',
    displayName: 'displayName',
    emailVerified: true,
  };

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

test('startProgressServiceEpic', done => {
  let assertionExecutedCount = 0;

  const incomingActions = [
    { type: actionTypes.INIT_AUTH },
    { type: actionTypes.GET_OR_CREATE_USER_INFO },
    { type: actionTypes.SIGN_IN_WITH_EMAIL },
    { type: actionTypes.SIGN_UP_WITH_EMAIL },
    { type: actionTypes.SEND_EMAIL_VERIFICATION },
    { type: actionTypes.SEND_PASSWORD_RESET_EMAIL },
    { type: actionTypes.CREATE_POST },
    { type: actionTypes.EDIT_POST },
  ];

  // @ts-ignore
  startProgressServiceEpic(of(...incomingActions)).subscribe(
    outcomingAction => {
      expect(outcomingAction).toEqual({
        type: actionTypes.START_PROGRESS,
        payload: 'TODO_REMOVE_THIS',
      });
      assertionExecutedCount += 1;
    },
    null,
    () => {
      expect(assertionExecutedCount).toBe(incomingActions.length);
      done();
    },
  );
});

test('stopProgressServiceEpic', done => {
  let assertionExecutedCount = 0;

  const incomingActions = [
    { type: actionTypes.INIT_AUTH_USER_HAS_CREDENTIAL },
    { type: actionTypes.INIT_AUTH_USER_HAS_NO_CREDENTIAL },
    { type: actionTypes.INIT_AUTH_FAIL },
    { type: actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS },
    { type: actionTypes.GET_OR_CREATE_USER_INFO_FAIL },
    { type: actionTypes.SIGN_IN_WITH_EMAIL_SUCCESS },
    { type: actionTypes.SIGN_IN_WITH_EMAIL_FAIL },
    { type: actionTypes.SIGN_UP_WITH_EMAIL_SUCCESS },
    { type: actionTypes.SIGN_UP_WITH_EMAIL_FAIL },
    { type: actionTypes.SEND_EMAIL_VERIFICATION_SUCCESS },
    { type: actionTypes.SEND_EMAIL_VERIFICATION_FAIL },
    { type: actionTypes.SEND_PASSWORD_RESET_EMAIL_SUCCESS },
    { type: actionTypes.SEND_PASSWORD_RESET_EMAIL_FAIL },
    { type: actionTypes.CREATE_POST_SUCCESS },
    { type: actionTypes.CREATE_POST_FAIL },
    { type: actionTypes.EDIT_POST_SUCCESS },
    { type: actionTypes.EDIT_POST_FAIL },
  ];

  // @ts-ignore
  stopProgressServiceEpic(of(...incomingActions)).subscribe(
    outcomingAction => {
      expect(outcomingAction).toEqual({
        type: actionTypes.FINISH_PROGRESS,
        payload: 'TODO_REMOVE_THIS',
      });
      assertionExecutedCount += 1;
    },
    null,
    () => {
      expect(assertionExecutedCount).toBe(incomingActions.length);
      done();
    },
  );
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
  const mockSpecificErrorFromFirebaseSDK = {
    code: 'auth/invalid-email',
  };

  const incomingActions = [
    {
      type: actionTypes.SIGN_IN_WITH_EMAIL_FAIL,
      payload: mockSpecificErrorFromFirebaseSDK,
    },
    {
      type: actionTypes.SIGN_IN_WITH_EMAIL_FAIL,
    },
  ];

  const expectedActions = [
    // show specific error if error from firebase sdk is provided
    {
      type: actionTypes.ADD_SNACKBAR_QUEUE,
      payload: 'メールアドレスの形式が正しくありません',
    },
    // show general error message
    {
      type: actionTypes.ADD_SNACKBAR_QUEUE,
      payload: 'サインインに失敗しました',
    },
  ];

  let assertionExecutedCount = 0;

  // @ts-ignore
  snackbarEpic(from(incomingActions)).subscribe(
    outcomingAction => {
      expect(outcomingAction).toEqual(expectedActions[assertionExecutedCount]);
      assertionExecutedCount += 1;
    },
    null,
    () => {
      expect(assertionExecutedCount).toBe(incomingActions.length);
      done();
    },
  );
});
