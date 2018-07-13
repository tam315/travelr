const firebase = require('firebase-admin');
const request = require('supertest');

const app = require('../../index');

jest.mock('firebase-admin');

const mock = {
  verifyIdToken: jest.fn().mockReturnValue({}),
};
firebase.auth = jest.fn(() => ({
  verifyIdToken: mock.verifyIdToken,
}));

const { DUMMY_TOKEN } = require('../../dummies/dummies');

describe('authentication controller', () => {
  const baseRequest = () => request(app).post('/users');

  test('check fails if no token is provided', async () => {
    const res = await baseRequest();

    expect(res.status).toBe(401);
    expect(res.text).toBe("missing 'authorization' header");
  });

  test('check succeed if dummy token is provided', async () => {
    const res = await baseRequest().set('authorization', DUMMY_TOKEN);

    expect(res.status).toBe(200);
  });

  test('check fail if token is invalid', async () => {
    const res = await baseRequest().set('authorization', 'invalid_token');

    expect(res.status).toBe(401);
    expect(res.text).toBe('firebase user not found');
  });

  test('check succeed if token is valid', async () => {
    mock.verifyIdToken.mockReturnValue({ user_id: '123' });
    const res = await baseRequest().set('authorization', 'invalid_token');

    // 'display name missing' is the next controller's messege
    // so this indicate authentication controller was successfully passed.
    expect(res.text).toBe('display name missing');
  });
});
