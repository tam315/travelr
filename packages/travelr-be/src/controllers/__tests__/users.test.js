const request = require('supertest');

const app = require('../../index');
const dbHelper = require('../../helper/db');
const { db } = dbHelper;

const authenticationController = require('../authentication');
const {
  DUMMY_ID_FOR_TESTING,
  DUMMY_HEADER_FOR_TESTING,
  DUMMY_TOKEN_FOR_TESTING,
} = authenticationController;

const deleteDummyUser = async () => {
  await db.oneOrNone(
    'DELETE FROM users WHERE id = $1 RETURNING *;',
    DUMMY_ID_FOR_TESTING,
  );
};

const createDummyUser = async () => {
  await deleteDummyUser();

  await db.one(
    'INSERT INTO users(id, display_name) VALUES ($1, $2) RETURNING *;',
    [DUMMY_ID_FOR_TESTING, 'displayName'],
  );
};

// disconnect all db sessions each time the test is finished.
// If not, the session will infinitely
// increase and eventually the test will fail.
afterAll(() => {
  dbHelper.shutdown();
});

beforeEach(async () => {
  await createDummyUser();
});

afterEach(async () => {
  await deleteDummyUser();
});

describe('POST /users', () => {
  const baseRequest = () =>
    request(app)
      .post('/users')
      .set(DUMMY_HEADER_FOR_TESTING, true);

  test('returns 401 if user not authorized', async () => {
    const res = await baseRequest();

    expect(res.status).toBe(401);
  });

  test('returns 400 if request has only token and missing body', async () => {
    const res = await baseRequest().set(
      'authorization',
      DUMMY_TOKEN_FOR_TESTING,
    );

    expect(res.status).toBe(400);
    expect(res.text).toBe('display name missing');
  });

  test('returns 200 if request has token and valid body', async () => {
    await deleteDummyUser();

    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN_FOR_TESTING)
      .send({ displayName: 'displayName' });

    expect(res.status).toBe(200);
  });

  test("returns 400 if it's duplicate registration", async () => {
    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN_FOR_TESTING)
      .send({ displayName: 'displayName' });

    expect(res.status).toBe(400);
  });
});

describe('GET /users/:userId', () => {
  const baseRequest = () =>
    request(app)
      .get(`/users/${DUMMY_ID_FOR_TESTING}`)
      .set(DUMMY_HEADER_FOR_TESTING, true);

  test('returns 421 if user not found', async () => {
    await deleteDummyUser();
    await baseRequest().expect(421);
  });

  test('returns 200 if user found', async () => {
    await baseRequest().expect(200);
  });

  test('returns valid body if user found', async () => {
    const res = await baseRequest().expect(200);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('displayName');
    expect(res.body).toHaveProperty('isAdmin');
    expect(res.body).toHaveProperty('earnedLikes');
    expect(res.body).toHaveProperty('earnedComments');
    expect(res.body).toHaveProperty('earnedViews');
  });
});
