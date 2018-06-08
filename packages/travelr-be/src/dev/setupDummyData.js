const loremIpsum = require('lorem-ipsum');
const prompt = require('prompt');
const randomString = require('random-string');
const pgPromise = require('pg-promise')();

const dbHelper = require('../helper/db');
const { getRandomInt, getRandomDouble } = require('../helper/math');
const config = require('../../config');

const USER_COUNT = 2000;
const POST_COUNT = 10000;
const COMMENT_COUNT = 2000;
const LIKE_COUNT = 30000;

const db = dbHelper.db;

const actions = {
  '1': () => setupDummyUsers(),
  '2': () => setupDummyPosts(),
  '3': () => setupDummyLikes(),
  '4': () => setupDummyComments(),
  '9': () => process.exit(0),
};

// prompt
prompt.start();
console.log('What do you want:');
console.log('1: Setup dummy users');
console.log('2: Setup dummy posts');
console.log('3: Setup dummy likes');
console.log('4: Setup dummy comments');
console.log('9: Exit');

prompt.get(['choice'], (err, result) => {
  actions[result.choice]();
});

const getUsersFromDB = () => {
  return db.many('SELECT * FROM users');
};

const getPostsFromDB = () => {
  return db.many('SELECT * FROM posts');
};

const setupDummyUsers = async () => {
  const users = [];
  for (let i = 0; i < USER_COUNT; i += 1) {
    users.push({
      id: randomString({ length: 28 }),
      display_name: loremIpsum({
        sentenceUpperBound: 1,
        units: 'words',
        count: 1,
      }),
      is_admin: false,
    });
  }

  const column = ['id', 'display_name', 'is_admin'];
  const columnSet = new pgPromise.helpers.ColumnSet(column, { table: 'users' });
  const query = pgPromise.helpers.insert(users, columnSet);

  await db.none('DELETE FROM users');
  await db.none(query);
  console.log('succeed addition of users');
};

const setupDummyPosts = async () => {
  const DUMMY_IMAGES = [
    'http://lorempixel.com/200/200',
    'http://lorempixel.com/200/300',
    'http://lorempixel.com/200/400',
    'http://lorempixel.com/300/200',
    'http://lorempixel.com/300/300',
    'http://lorempixel.com/300/400',
    'http://lorempixel.com/400/200',
    'http://lorempixel.com/400/300',
    'http://lorempixel.com/400/400',
    'http://lorempixel.com/500/200',
  ];

  let posts = [];

  const users = await getUsersFromDB(db);

  for (let i = 0; i < POST_COUNT; i += 1) {
    const lng = getRandomDouble(130, 145);
    const lat = getRandomDouble(45, 30);

    posts.push({
      user_id: users[getRandomInt(users.length - 1)].id,
      old_image_url: DUMMY_IMAGES[getRandomInt(DUMMY_IMAGES.length - 1)],
      new_image_url: DUMMY_IMAGES[getRandomInt(DUMMY_IMAGES.length - 1)],
      description: loremIpsum(),
      shoot_date: new Date(
        getRandomInt(1527814486286, -2027814486286),
      ).toLocaleDateString(),
      geom: pgPromise.as.format('ST_GeomFromText($1, $2)', [
        `POINT(${lng} ${lat})`,
        config.SRID,
      ]),
      view_count: getRandomInt(1000, 0),
    });
  }

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
  const columnSet = new pgPromise.helpers.ColumnSet(column, { table: 'posts' });
  const query = pgPromise.helpers.insert(posts, columnSet);

  await db.none('DELETE FROM posts');
  await db.none(query);

  console.log('succeed addition of posts');
};

const setupDummyLikes = async () => {
  const users = await getUsersFromDB(db);
  const posts = await getPostsFromDB(db);
  const likes = [];

  let count = 0;
  const memory = {};

  while (count < LIKE_COUNT) {
    const postId = posts[getRandomInt(posts.length - 1)].id;
    const userId = users[getRandomInt(users.length - 1)].id;

    if (memory[userId] && memory[userId][postId]) continue;

    if (!memory[userId]) memory[userId] = {};

    memory[userId][postId] = true;

    likes.push({
      post_id: postId,
      user_id: userId,
    });
    count += 1;
  }

  const column = ['post_id', 'user_id'];
  const columnSet = new pgPromise.helpers.ColumnSet(column, { table: 'likes' });
  const query = pgPromise.helpers.insert(likes, columnSet);

  await db.none('DELETE FROM likes');
  await db.none(query);

  console.log('succeed addition of likes');
};

const setupDummyComments = async () => {
  const users = await getUsersFromDB(db);
  const posts = await getPostsFromDB(db);

  const comments = [];

  for (let i = 0; i < COMMENT_COUNT; i += 1) {
    comments.push({
      post_id: posts[getRandomInt(posts.length - 1)].id,
      user_id: users[getRandomInt(users.length - 1)].id,
      datetime: new Date(
        getRandomInt(1527814486286, 1027814486286),
      ).toLocaleString(),
      comment: loremIpsum(),
    });
  }

  const column = ['post_id', 'user_id', 'datetime', 'comment'];
  const columnSet = new pgPromise.helpers.ColumnSet(column, {
    table: 'comments',
  });
  const query = pgPromise.helpers.insert(comments, columnSet);

  await db.none('DELETE FROM comments');
  await db.none(query);

  console.log('succeed addition of comments');
};
