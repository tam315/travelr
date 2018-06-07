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

  test('returns 400 and message if body is invalid', async () => {
    const res = await baseRequest().set(
      'authorization',
      DUMMY_TOKEN_FOR_TESTING,
    );

    expect(res.status).toBe(400);
    expect(res.text).toBe('display name missing');
  });

  test("returns 400 if it's duplicate registration", async () => {
    await createDummyUser();
    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN_FOR_TESTING)
      .send({ displayName: 'displayName' });

    expect(res.status).toBe(400);
  });

  test('returns 200 if user created', async () => {
    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN_FOR_TESTING)
      .send({ displayName: 'displayName' });

    expect(res.status).toBe(200);
  });
});

describe('GET /users/:userId', () => {
  const baseRequest = () =>
    request(app)
      .get(`/users/${DUMMY_ID_FOR_TESTING}`)
      .set(DUMMY_HEADER_FOR_TESTING, true);

  test('returns 400 and message if user not found', async () => {
    const res = await baseRequest();

    expect(res.status).toBe(400);
    expect(res.text).toBe('user not found');
  });

  test('returns 200 and valid body if user found', async () => {
    await createDummyUser();
    const res = await baseRequest();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('displayName');
    expect(res.body).toHaveProperty('isAdmin');
    expect(res.body).toHaveProperty('earnedLikes');
    expect(res.body).toHaveProperty('earnedComments');
    expect(res.body).toHaveProperty('earnedViews');
  });
});

describe('PUT /users/:userId', () => {
  const baseRequest = () =>
    request(app)
      .put(`/users/${DUMMY_ID_FOR_TESTING}`)
      .set(DUMMY_HEADER_FOR_TESTING, true);

  test('returns 401 if user not authorized', async () => {
    const res = await baseRequest();

    expect(res.status).toBe(401);
  });

  test('returns 400 and message if body is invalid', async () => {
    const res = await baseRequest().set(
      'authorization',
      DUMMY_TOKEN_FOR_TESTING,
    );

    expect(res.status).toBe(400);
    expect(res.text).toBe('display name missing');
  });

  test("returns 400 and message if url param doesn't match the authented user's id", async () => {
    const res = await request(app)
      .put(`/users/someInvalidId`)
      .set('authorization', DUMMY_TOKEN_FOR_TESTING)
      .set(DUMMY_HEADER_FOR_TESTING, true)
      .send({ displayName: 'displayName' });

    expect(res.status).toBe(400);
    expect(res.text).toBe("param doe's not match authenticated user");
  });

  test('returns 200 if user updated', async () => {
    await createDummyUser();
    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN_FOR_TESTING)
      .send({ displayName: 'displayName' });

    expect(res.status).toBe(200);
  });
});

describe('DELETE /users/:userId', () => {
  const baseRequest = () =>
    request(app)
      .delete(`/users/${DUMMY_ID_FOR_TESTING}`)
      .set(DUMMY_HEADER_FOR_TESTING, true);

  test('returns 401 if user not authorized', async () => {
    const res = await baseRequest();

    expect(res.status).toBe(401);
  });

  test("returns 400 and message if url param doesn't match the authented user's id", async () => {
    const res = await request(app)
      .delete(`/users/someInvalidId`)
      .set('authorization', DUMMY_TOKEN_FOR_TESTING)
      .set(DUMMY_HEADER_FOR_TESTING, true);

    expect(res.status).toBe(400);
    expect(res.text).toBe("param doe's not match authenticated user");
  });

  test('returns 400 and message if user not found', async () => {
    const res = await baseRequest().set(
      'authorization',
      DUMMY_TOKEN_FOR_TESTING,
    );

    expect(res.status).toBe(400);
    expect(res.text).toBe('No data returned from the query.');
  });

  test('returns 200 if user deleted', async () => {
    await createDummyUser();
    const res = await baseRequest().set(
      'authorization',
      DUMMY_TOKEN_FOR_TESTING,
    );

    expect(res.status).toBe(200);
  });
});
