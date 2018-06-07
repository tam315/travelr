const request = require('supertest');

const config = require('../../../config');
const app = require('../../index');
const dbHelper = require('../../helper/db');
const {
  DUMMY_POSTS,
  DUMMY_USER_ID_FOR_TESTING,
} = require('../../dummies/dummies');
const { db, pgPromise } = dbHelper;

const deleteDummyPosts = async () => {
  // delete posts
  DUMMY_POSTS.forEach(async post => {
    await db.oneOrNone(
      'DELETE FROM posts WHERE user_id = $1 RETURNING *',
      DUMMY_USER_ID_FOR_TESTING,
    );
  });

  // delete user
  await db.oneOrNone(
    'DELETE FROM users WHERE id = $1 RETURNING *;',
    DUMMY_USER_ID_FOR_TESTING,
  );
};

const createDummyPosts = async () => {
  // delete posts and user
  await deleteDummyPosts();

  // create user
  await db.one(
    'INSERT INTO users(id, display_name) VALUES ($1, $2) RETURNING *;',
    [DUMMY_USER_ID_FOR_TESTING, 'dummy_display_name'],
  );

  // create posts
  const column = [
    'user_id',
    'old_image_url',
    'new_image_url',
    'description',
    'shoot_date',
    {
      name: 'geom',
      mod: '^', // format as raw text
    },
    'view_count',
  ];
  const columnSet = new pgPromise.helpers.ColumnSet(column, {
    table: 'posts',
  });
  const query = pgPromise.helpers.insert(DUMMY_POSTS, columnSet);
  await db.none(query);
};

afterAll(() => {
  pgPromise.end();
});

beforeAll(async () => {
  await createDummyPosts();
});

describe('GET /posts', async () => {
  test('returns 200 if success', async () => {
    const res = await request(app).get('/posts');

    expect(res.status).toBe(200);
  });

  test('returns array if success', async () => {
    const res = await request(app).get('/posts');

    expect(res.body instanceof Array).toBeTruthy();
  });

  test('returns valid body if success', async () => {
    const res = await request(app).get('/posts');

    expect(res.body[0]).toHaveProperty('postId');
    expect(res.body[0]).toHaveProperty('userId');
    expect(res.body[0]).toHaveProperty('oldImageUrl');
    expect(res.body[0]).toHaveProperty('newImageUrl');
    expect(res.body[0]).toHaveProperty('description');
    expect(res.body[0]).toHaveProperty('shootDate');
    expect(res.body[0]).toHaveProperty('lng');
    expect(res.body[0]).toHaveProperty('lat');
    expect(res.body[0]).toHaveProperty('viewCount');
    expect(res.body[0]).toHaveProperty('displayName');
    expect(res.body[0]).toHaveProperty('likedCount');
    expect(res.body[0]).toHaveProperty('commentsCount');
  });
});
