import { from, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  fetchAllPostsEpic,
  fetchPostEpic,
  getOrCreateUserInfoEpic,
  initAuthEpic,
  redirectorEpic,
  snackbarEpic,
  startProgressServiceEpic,
  stopProgressServiceEpic,
  mapZoomAndCenterUpdaterEpic,
} from '..';
import actionTypes from '../../actions/types';
import {
  DUMMY_FILTER_CRITERION,
  DUMMY_POSTS,
  DUMMY_USER_STORE,
  DUMMY_USER_STORE_UNAUTHORIZED,
} from '../../config/dummies';
import { AuthSeed } from '../../config/types';
import firebaseUtils from '../../utils/firebaseUtils';
import history from '../../utils/history';
import { getPositionFromPlaceName } from '../../utils/mapsUtils';

declare const fetch: any;

jest.mock('../../utils/firebaseUtils');
jest.mock('../../utils/history');
jest.mock('../../utils/mapsUtils');

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
  fetch.resetMocks();
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
        expect(outcomingAction.type).toEqual(actionTypes.INIT_AUTH_FAIL);
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
        expect(outcomingAction.type).toEqual(
          actionTypes.GET_OR_CREATE_USER_INFO_FAIL,
        );
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

describe('fetchAllPostsEpic', () => {
  test('generates correct url', done => {
    const criterion = DUMMY_FILTER_CRITERION;
    const DUMMY_LAT_LNG = { lat: 1, lng: 2 };
    // @ts-ignore
    getPositionFromPlaceName.mockResolvedValue(DUMMY_LAT_LNG);

    fetch.mockResponse(JSON.stringify(DUMMY_POSTS[0]));

    const incomingActions = [
      {
        type: actionTypes.FETCH_ALL_POSTS,
      },
    ];

    const state = {
      value: {
        filter: {
          criterion,
        },
      },
    };

    let assertionExecutedCount = 0;

    // @ts-ignore
    fetchAllPostsEpic(from(incomingActions), state).subscribe(
      outcomingAction => {
        expect(fetch.mock.calls[assertionExecutedCount][0]).toContain(
          `posts?` +
            `display_name=${DUMMY_FILTER_CRITERION.displayName}` +
            `&description=${DUMMY_FILTER_CRITERION.description}` +
            `&min_date=${DUMMY_FILTER_CRITERION.shootDate.min}-01-01` +
            `&max_date=${DUMMY_FILTER_CRITERION.shootDate.max}-12-31` +
            `&lng=${DUMMY_LAT_LNG.lng}` +
            `&lat=${DUMMY_LAT_LNG.lat}` +
            `&radius=${DUMMY_FILTER_CRITERION.radius}` +
            `&min_view_count=${DUMMY_FILTER_CRITERION.viewCount.min}` +
            `&max_view_count=${DUMMY_FILTER_CRITERION.viewCount.max}` +
            `&min_liked_count=${DUMMY_FILTER_CRITERION.likedCount.min}` +
            `&max_liked_count=${DUMMY_FILTER_CRITERION.likedCount.max}` +
            `&min_comments_count=${DUMMY_FILTER_CRITERION.commentsCount.min}` +
            `&max_comments_count=${DUMMY_FILTER_CRITERION.commentsCount.max}`,
        );

        expect(outcomingAction).toEqual({
          type: actionTypes.FETCH_ALL_POSTS_SUCCESS,
          payload: DUMMY_POSTS[0],
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

  test('makes correct action when fail', done => {
    // @ts-ignore
    getPositionFromPlaceName.mockRejectedValue();

    const incomingActions = [
      {
        type: actionTypes.FETCH_ALL_POSTS,
      },
    ];
    const state = {};

    let assertionExecutedCount = 0;

    // @ts-ignore
    fetchAllPostsEpic(from(incomingActions), state).subscribe(
      outcomingAction => {
        expect(outcomingAction.type).toBe(actionTypes.FETCH_ALL_POSTS_FAIL);
        expect(outcomingAction.payload).toBeTruthy();

        assertionExecutedCount += 1;
      },
      null,
      () => {
        expect(assertionExecutedCount).toBe(incomingActions.length);
        done();
      },
    );
  });
});

describe('fetchPostEpic', () => {
  test('if success (if user is NOT authenticated)', done => {
    const DUMMY_POST_ID = DUMMY_POSTS[0].postId;

    fetch.mockResponse(JSON.stringify(DUMMY_POSTS[0]));

    const incomingActions = [
      {
        type: actionTypes.FETCH_POST,
        payload: DUMMY_POST_ID,
      },
      {
        type: actionTypes.CREATE_COMMENT_SUCCESS,
        payload: DUMMY_POST_ID,
      },
      {
        type: actionTypes.DELETE_COMMENT_SUCCESS,
        payload: DUMMY_POST_ID,
      },
      {
        type: actionTypes.TOGGLE_LIKE_SUCCESS,
        payload: DUMMY_POST_ID,
      },
    ];

    const state$ = {
      value: {
        user: DUMMY_USER_STORE_UNAUTHORIZED,
      },
    };

    let assertionExecutedCount = 0;

    // @ts-ignore
    fetchPostEpic(from(incomingActions), state$).subscribe(
      outcomingAction => {
        expect(fetch.mock.calls[assertionExecutedCount][0]).toContain(
          `/posts/${DUMMY_POST_ID}`,
        );
        expect(fetch.mock.calls[assertionExecutedCount][0]).not.toContain(
          `?user_id=${DUMMY_USER_STORE.userId}`,
        );
        expect(outcomingAction).toEqual({
          type: actionTypes.FETCH_POST_SUCCESS,
          payload: DUMMY_POSTS[0],
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

  test('if success (if user IS authenticated)', done => {
    const DUMMY_POST_ID = DUMMY_POSTS[0].postId;

    fetch.mockResponse(JSON.stringify(DUMMY_POSTS[0]));

    const incomingActions = [
      {
        type: actionTypes.FETCH_POST,
        payload: DUMMY_POST_ID,
      },
      {
        type: actionTypes.CREATE_COMMENT_SUCCESS,
        payload: DUMMY_POST_ID,
      },
      {
        type: actionTypes.DELETE_COMMENT_SUCCESS,
        payload: DUMMY_POST_ID,
      },
      {
        type: actionTypes.TOGGLE_LIKE_SUCCESS,
        payload: DUMMY_POST_ID,
      },
    ];

    const state$ = {
      value: {
        user: DUMMY_USER_STORE,
      },
    };

    let assertionExecutedCount = 0;

    // @ts-ignore
    fetchPostEpic(from(incomingActions), state$).subscribe(
      outcomingAction => {
        expect(fetch.mock.calls[assertionExecutedCount][0]).toContain(
          `/posts/${DUMMY_POST_ID}?user_id=${DUMMY_USER_STORE.userId}`,
        );
        expect(outcomingAction).toEqual({
          type: actionTypes.FETCH_POST_SUCCESS,
          payload: DUMMY_POSTS[0],
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

  test('if fail', done => {
    const DUMMY_POST_ID = DUMMY_POSTS[0].postId;

    fetch.mockReject(JSON.stringify(DUMMY_POSTS[0]));

    const incomingActions = [
      {
        type: actionTypes.FETCH_POST,
        payload: DUMMY_POST_ID,
      },
    ];

    let assertionExecutedCount = 0;

    // @ts-ignore
    fetchPostEpic(from(incomingActions)).subscribe(
      outcomingAction => {
        expect(outcomingAction.type).toBe(actionTypes.FETCH_POST_FAIL);
        expect(outcomingAction.payload).toBeTruthy();
        assertionExecutedCount += 1;
      },
      null,
      () => {
        expect(assertionExecutedCount).toBe(incomingActions.length);
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
      expect(outcomingAction.type).toBe(actionTypes.START_PROGRESS);
      expect(typeof outcomingAction.payload).toBe('string');
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
      expect(outcomingAction.type).toBe(actionTypes.FINISH_PROGRESS);
      expect(typeof outcomingAction.payload).toBe('string');
      assertionExecutedCount += 1;
    },
    null,
    () => {
      expect(assertionExecutedCount).toBe(incomingActions.length);
      done();
    },
  );
});

describe('mapZoomAndCenterUpdaterEpic', () => {
  test('if success', done => {
    let assertionExecutedCount = 0;

    // @ts-ignore
    getPositionFromPlaceName.mockResolvedValue({ lat: 1, lng: 2 });

    const state$ = {
      value: {
        filter: {
          criterion: {
            placeName: 'dummy_city',
            radius: '3',
          },
        },
      },
    };
    const incomingActions = [
      {
        type: actionTypes.CHANGE_FILTER_CRITERION_SUCCESS,
      },
    ];

    // @ts-ignore
    mapZoomAndCenterUpdaterEpic(of(...incomingActions), state$).subscribe(
      outcomingAction => {
        expect(outcomingAction).toEqual({
          type: actionTypes.UPDATE_MAP_ZOOM_AND_CENTER_SUCCESS,
          payload: { lat: 1, lng: 2, radius: '3' },
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

  test('if fail', done => {
    let assertionExecutedCount = 0;

    // @ts-ignore
    getPositionFromPlaceName.mockRejectedValue({});

    const state$ = {
      value: {
        filter: {
          criterion: {
            placeName: 'dummy_city',
            radius: '3',
          },
        },
      },
    };
    const incomingActions = [
      {
        type: actionTypes.CHANGE_FILTER_CRITERION_SUCCESS,
      },
    ];

    // @ts-ignore
    mapZoomAndCenterUpdaterEpic(of(...incomingActions), state$).subscribe(
      outcomingAction => {
        expect(outcomingAction.type).toBe(
          actionTypes.UPDATE_MAP_ZOOM_AND_CENTER_FAIL,
        );
        expect(outcomingAction).toHaveProperty('payload');
        assertionExecutedCount += 1;
      },
      null,
      () => {
        expect(assertionExecutedCount).toBe(incomingActions.length);
        done();
      },
    );
  });
});

test('redirectorEpic', done => {
  let assertionExecutedCount = 0;
  history.location.pathname = '/auth';

  const incomingActions = [
    { type: actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS },
    { type: actionTypes.DELETE_USER_SUCCESS },
    { type: actionTypes.SIGN_OUT_USER_SUCCESS },
    { type: actionTypes.CREATE_POST_SUCCESS },
    { type: actionTypes.EDIT_POST_SUCCESS },
    { type: actionTypes.DELETE_POST_SUCCESS },
  ];

  // @ts-ignore
  redirectorEpic(of(...incomingActions)).subscribe(
    outcomingAction => {
      expect(outcomingAction).toEqual({
        type: actionTypes.USER_REDIRECTED,
      });
      assertionExecutedCount += 1;
    },
    null,
    () => {
      expect(assertionExecutedCount).toBe(incomingActions.length);
      expect(history.push).toHaveBeenCalledTimes(incomingActions.length);
      done();
    },
  );
});

test('snackbarEpic', done => {
  const mockSpecificErrorFromFirebaseSDK = {
    code: 'auth/invalid-email',
  };

  const incomingActions = [
    {
      type: actionTypes.TOGGLE_LIKE_FAIL,
      payload: {
        message: "missing 'authorization' header",
      },
    },
    {
      type: actionTypes.SIGN_IN_WITH_EMAIL_FAIL,
      payload: mockSpecificErrorFromFirebaseSDK,
    },
    {
      type: actionTypes.SIGN_IN_WITH_EMAIL_FAIL,
      payload: {
        code: 'unknown error code',
      },
    },
    {
      type: actionTypes.SIGN_IN_WITH_EMAIL_FAIL,
    },
  ];

  const expectedActions = [
    {
      type: actionTypes.ADD_SNACKBAR_QUEUE,
      payload: 'この操作を行うためにはサインインが必要です',
    },
    {
      type: actionTypes.ADD_SNACKBAR_QUEUE,
      payload: 'メールアドレスの形式が正しくありません',
    },
    {
      type: actionTypes.ADD_SNACKBAR_QUEUE,
      payload: '不明なエラーが発生しました',
    },
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
