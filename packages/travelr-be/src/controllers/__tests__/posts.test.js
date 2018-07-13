const pgPromise = require('pg-promise')();
const request = require('supertest');

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
let DUMMY_COMMENTS_ID;

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

  // create posts and reserve its IDs
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

  // create comment for first dummy post
  const comment = await db.one(
    'INSERT INTO comments(post_id, user_id, datetime, comment) VALUES ($1, $2, $3, $4) RETURNING *',
    [DUMMY_POSTS_IDS[0], DUMMY_USER_ID, new Date().toISOString(), 'comment1'],
  );
  DUMMY_COMMENTS_ID = comment.id;

  // create 'Like' for first dummy post
  await db.one(
    'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *',
    [DUMMY_USER_ID, DUMMY_POSTS_IDS[0]],
  );
};

afterAll(async () => {
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
    expect(res.body[0]).toHaveProperty('createdAt');
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
    const radius = 0.5; // by kilo meter
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

    const isSuccess =
      !res.body.find(item => item.likedCount > max) &&
      !res.body.find(item => item.likedCount < min);

    expect(isSuccess).toBeTruthy();
  });

  test('returns data filtered by comments count', async () => {
    const min = 1;
    const max = 2;
    const res = await request(app).get(
      `/posts?min_comments_count=${min}&max_comments_count=${max}`,
    );

    if (!res.body.length) throw new Error('insufficient data');

    const isSuccess =
      !res.body.find(item => item.commentsCount > max) &&
      !res.body.find(item => item.commentsCount < min);

    expect(isSuccess).toBeTruthy();
  });

  test('returns data filtered by limit count', async () => {
    const LIMIT = 99;
    const res = await request(app).get(`/posts?limit=${LIMIT}`);

    expect(res.body.length).toBe(LIMIT);
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

  test('returns 200 and post id if post created', async () => {
    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN)
      .send(DUMMY_NEW_POST);

    expect(res.status).toBe(200);
    expect(res.body.postId).toBeTruthy();
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

  test('returns 400 and message if some post not deleted', async () => {
    const invalidPostId = 1234567890;
    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN)
      .send([...DUMMY_POSTS_IDS, invalidPostId]);

    expect(res.status).toBe(400);
    expect(res.text).toBe('some posts were not deleted');
  });

  test('returns 200 and count if posts deleted', async () => {
    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN)
      .send(DUMMY_POSTS_IDS);

    expect(res.status).toBe(200);
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
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('displayName');
    expect(res.body).toHaveProperty('likedCount');
    expect(res.body).toHaveProperty('commentsCount');
    expect(res.body.comments).toHaveLength(1);
    expect(res.body).not.toHaveProperty('likeStatus');
  });

  test('returns likeStatus if user_id query param is provided', async () => {
    const responseIfUserFound = await request(app).get(
      `/posts/${DUMMY_POSTS_IDS[0]}?user_id=${DUMMY_USER_ID}`,
    );
    expect(responseIfUserFound.body).toHaveProperty('likeStatus');
    expect(responseIfUserFound.body.likeStatus).toBe(true);

    const responseIfUserNotFound = await request(app).get(
      `/posts/${DUMMY_POSTS_IDS[0]}?user_id=INVALID_USERID`,
    );
    expect(responseIfUserNotFound.body).toHaveProperty('likeStatus');
    expect(responseIfUserNotFound.body.likeStatus).toBe(false);
  });

  test('returns view_count incremented by one', async () => {
    // fetch dummy post's original state
    const [originalPost] = await db.many(
      'SELECT id, view_count FROM posts WHERE user_id = $1',
      DUMMY_USER_ID,
    );

    // fetch dummy post using API
    const { body: updatedPost } = await request(app).get(
      `/posts/${originalPost.id}`,
    );

    expect(updatedPost.viewCount).toBe(originalPost.view_count + 1);
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

describe('GET /posts/:postId/comments', async () => {
  test('returns 200 and empty array if comments not found', async () => {
    const postId = 1234567890;
    const res = await request(app).get(`/posts/${postId}/comments`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns 200 and valid body if comments found', async () => {
    const postId = DUMMY_POSTS_IDS[0];
    const res = await request(app).get(`/posts/${postId}/comments`);

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('commentId');
    expect(res.body[0]).toHaveProperty('postId');
    expect(res.body[0]).toHaveProperty('userId');
    expect(res.body[0]).toHaveProperty('datetime');
    expect(res.body[0]).toHaveProperty('comment');
    expect(res.body[0]).toHaveProperty('displayName');
  });
});

describe('POST /posts/:postId/comments', async () => {
  test('returns 401 if user not authorized', async () => {
    const postId = 1234567890;
    const res = await request(app).post(`/posts/${postId}/comments`);
    expect(res.status).toBe(401);
  });

  test('returns 400 and message if body is missing', async () => {
    const postId = DUMMY_POSTS_IDS[0];
    const res = await request(app)
      .post(`/posts/${postId}/comments`)
      .set('authorization', DUMMY_TOKEN);

    expect(res.status).toBe(400);
    expect(res.text).toBe('body missing');
  });

  test('returns 200 if comment created', async () => {
    const postId = DUMMY_POSTS_IDS[0];
    const res = await request(app)
      .post(`/posts/${postId}/comments`)
      .set('authorization', DUMMY_TOKEN)
      .send({ comment: 'dummy_comment' });

    expect(res.status).toBe(200);
  });
});

describe('POST /posts/:postId/like/toggle', async () => {
  test('returns 401 if user not authorized', async () => {
    const postId = 1234567890;
    const res = await request(app).post(`/posts/${postId}/like/toggle`);
    expect(res.status).toBe(401);
  });

  test('returns 200 if like created', async () => {
    const postId = DUMMY_POSTS_IDS[0];

    // like
    const res1 = await request(app)
      .post(`/posts/${postId}/like/toggle`)
      .set('authorization', DUMMY_TOKEN);

    // dislike
    const res2 = await request(app)
      .post(`/posts/${postId}/like/toggle`)
      .set('authorization', DUMMY_TOKEN);

    expect(res1.status).toBe(200);
    expect(res1.body.likeStatus).toBeFalsy();
    expect(res2.status).toBe(200);
    expect(res2.body.likeStatus).toBeTruthy();
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

describe('PUT /posts/comments/:commentId', async () => {
  const baseRequest = () =>
    request(app).put(`/posts/comments/${DUMMY_COMMENTS_ID}`);

  test('returns 401 if user not authorized', async () => {
    const res = await baseRequest();
    expect(res.status).toBe(401);
  });

  test('returns 400 and message if no body', async () => {
    const res = await baseRequest().set('authorization', DUMMY_TOKEN);
    expect(res.status).toBe(400);
    expect(res.text).toBe('body missing');
  });

  test('return 200 and valid body if comment updated', async () => {
    const commentShouldBe = {
      comment: 'updated_comment',
    };

    const res = await baseRequest()
      .set('authorization', DUMMY_TOKEN)
      .send(commentShouldBe);

    expect(res.status).toBe(200);
  });
});

describe('DELETE /posts/comments/:commentId', async () => {
  const baseRequest = () =>
    request(app).delete(`/posts/comments/${DUMMY_COMMENTS_ID}`);

  test('returns 401 if user not authorized', async () => {
    const res = await baseRequest();
    expect(res.status).toBe(401);
  });

  test('return 200 if comment deleted', async () => {
    const res = await baseRequest().set('authorization', DUMMY_TOKEN);
    expect(res.status).toBe(200);
  });
});
