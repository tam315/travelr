const pgPromise = require('pg-promise')();
const request = require('supertest');

const config = require('../../../config');
const app = require('../../index');
const dbHelper = require('../../helper/db');
const {
  DUMMY_NEW_POST,
  DUMMY_POSTS,
  DUMMY_TOKEN,
  DUMMY_USER_DISPLAY_NAME,
  DUMMY_USER_ID,
} = require('../../dummies/dummies');

let DUMMY_POSTS_IDS;

const { db } = dbHelper;

const cleanUpDummyDatabase = async () => {
  // delete dummy user and related records
  await db.oneOrNone(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    DUMMY_USER_ID,
  );
};

const setupDummyDatabase = async () => {
  await cleanUpDummyDatabase();

  // create user
  await db.one(
    'INSERT INTO users(id, display_name) VALUES ($1, $2) RETURNING *;',
    [DUMMY_USER_ID, DUMMY_USER_DISPLAY_NAME],
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

  const query = pgPromise.helpers.insert(DUMMY_POSTS, column, 'posts');
  const posts = await db.many(`${query} RETURNING *`);
  DUMMY_POSTS_IDS = posts.map(post => post.id);
};

afterAll(async () => {
  await cleanUpDummyDatabase();
  pgPromise.end();
});

beforeEach(async () => {
  await setupDummyDatabase();
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

  test('returns empty array if no data found', async () => {
    const res = await request(app).get('/posts?user_id=someInvalidId');

    expect(res.body).toEqual([]);
  });

  test('returns data filtered by user_id', async () => {
    const res = await request(app).get(`/posts?user_id=${DUMMY_USER_ID}`);

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by display_name', async () => {
    const res = await request(app).get(
      `/posts?display_name=${DUMMY_USER_DISPLAY_NAME}`,
    );

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by description', async () => {
    const serachWord = '_description';
    const res = await request(app).get(`/posts?description=${serachWord}`);

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by date', async () => {
    const minDate = '1800-01-01';
    const maxDate = '1800-02-02';
    const res = await request(app).get(
      `/posts?min_date=${minDate}&max_date=${maxDate}`,
    );

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by lng, lat, radius', async () => {
    const lng = 10.001;
    const lat = 20.001;
    const radius = 500; // by meter
    const res = await request(app).get(
      `/posts?lng=${lng}&lat=${lat}&radius=${radius}`,
    );

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by view count', async () => {
    const min = 50000;
    const max = 50001;
    const res = await request(app).get(
      `/posts?min_view_count=${min}&max_view_count=${max}`,
    );

    expect(res.body.length).toBe(2);
  });

  test('returns data filtered by liked count', async () => {
    const min = 5;
    const max = 10;
    const res = await request(app).get(
      `/posts?min_liked_count=${min}&max_liked_count=${max}`,
    );

    if (!res.body.length) throw new Error('insufficient data');

    const fault =
      res.body.find(item => item.likedCount > max) ||
      res.body.find(item => item.likedCount < min);

    expect(fault).toBeFalsy();
  });

  test('returns data filtered by comments count', async () => {
    const min = 1;
    const max = 2;
    const res = await request(app).get(
      `/posts?min_comments_count=${min}&max_comments_count=${max}`,
    );

    if (!res.body.length) throw new Error('insufficient data');

    const fault =
      res.body.find(item => item.commentsCount > max) ||
      res.body.find(item => item.commentsCount < min);

    expect(fault).toBeFalsy();
  });
});

describe('POST /posts', async () => {
  const baseRequest = () => request(app).post('/posts');

  test('returns 401 if user not authorized', async () => {
    const res = await baseRequest();

    expect(res.status).toBe(401);
  });

  test('returns 400 and message if some key is missing in body', async () => {
    const res = await baseRequest().set('authorization', DUMMY_TOKEN);

    expect(res.status).toBe(400);
    expect(res.text).toBe('Some key is missing in body');
  });

  test('returns 200 if post created', async () => {
    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN)
      .send(DUMMY_NEW_POST);

    expect(res.status).toBe(200);
  });
});

describe('DELETE /posts', async () => {
  const baseRequest = () => request(app).delete('/posts');

  test('returns 401 if user not authorized', async () => {
    const res = await baseRequest();
    expect(res.status).toBe(401);
  });

  test('returns 400 and message if body is missing', async () => {
    const res = await baseRequest().set('authorization', DUMMY_TOKEN);
    expect(res.status).toBe(400);
  });

  test('returns 400 and message if body is empty array', async () => {
    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN)
      .send([]);
    expect(res.status).toBe(400);
  });

  test('returns 200 and count if posts deleted', async () => {
    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN)
      .send(DUMMY_POSTS_IDS);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
  });
});

describe('GET /posts/:postId', async () => {
  test('returns 400 and message if post not found', async () => {
    const invalidPostId = 1234567890;
    const res = await request(app).get(`/posts/${invalidPostId}`);
    expect(res.status).toBe(400);
    expect(res.text).toBe('post not found');
  });

  test('returns 200 and valid body if post found', async () => {
    const postId = DUMMY_POSTS_IDS[0];
    const res = await request(app).get(`/posts/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('postId');
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('oldImageUrl');
    expect(res.body).toHaveProperty('newImageUrl');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('shootDate');
    expect(res.body).toHaveProperty('lng');
    expect(res.body).toHaveProperty('lat');
    expect(res.body).toHaveProperty('viewCount');
    expect(res.body).toHaveProperty('displayName');
    expect(res.body).toHaveProperty('likedCount');
    expect(res.body).toHaveProperty('commentsCount');
  });
});

describe('PUT /posts/:postId', async () => {
  const baseRequest = () => request(app).put(`/posts/${DUMMY_POSTS_IDS[0]}`);

  test('returns 401 if user not authorized', async () => {
    const res = await baseRequest();
    expect(res.status).toBe(401);
  });

  test('returns 400 and message if no body', async () => {
    const res = await baseRequest().set('authorization', DUMMY_TOKEN);
    expect(res.status).toBe(400);
    expect(res.text).toBe('body missing');
  });

  test('return 200 and updated post if post updated', async () => {
    const postShouldBe = {
      oldImageUrl: 'updated_oldImageUrl',
      newImageUrl: 'updated_newImageUrl',
      description: 'updated_description',
      shootDate: '2000-01-01',
      lng: 10.004,
      lat: 20.004,
    };

    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN)
      .send(postShouldBe);

    const updatedPost = res.body;

    // 2000-01-01として記録されているDateをSELECTした場合、
    // pg-promiseが1999-12-31T15:00:00.000Zとして返してくるため、
    // ここでは検証対象から除外する
    delete postShouldBe.shootDate;

    expect(res.status).toBe(200);
    expect(updatedPost).toMatchObject(postShouldBe);
  });
});

describe('DELETE /posts/:postId', async () => {
  const baseRequest = () => request(app).delete(`/posts/${DUMMY_POSTS_IDS[0]}`);

  test('returns 401 if user not authorized', async () => {
    const res = await baseRequest();
    expect(res.status).toBe(401);
  });

  test('return 200 and if post deleted', async () => {
    const res = await baseRequest().set('authorization', DUMMY_TOKEN);
    expect(res.status).toBe(200);
  });
});

describe('GET /posts/:postId/increment_view_count', async () => {
  test('returns 400 and message if post not found', async () => {
    const invalidPostId = 1234567890;
    const res = await request(app).post(
      `/posts/${invalidPostId}/increment_view_count`,
    );
    expect(res.status).toBe(400);
    expect(res.text).toBe('No data returned from the query.');
  });

  test('returns 200 if success', async () => {
    // get post_id of dummy posts
    const posts = await db.many(
      'SELECT id, view_count FROM posts WHERE user_id = $1',
      DUMMY_USER_ID,
    );
    const postId = posts[0].id;
    const res = await request(app).post(
      `/posts/${postId}/increment_view_count`,
    );

    expect(res.body.viewCount).toBe(posts[0].view_count + 1);
  });
});
