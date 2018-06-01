const loremIpsum = require('lorem-ipsum');
const prompt = require('prompt');
const randomString = require('random-string');

const db = require('../helper/db');
const { getRandomInt, getRandomDouble } = require('../helper/math');

const pool = db.createPool();

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
  return pool.query('SELECT * FROM users');
};

const getPostsFromDB = () => {
  return pool.query('SELECT * FROM posts');
};

const setupDummyUsers = async () => {
  const users = [];
  for (let i = 0; i < 100; i += 1) {
    users.push({
      id: randomString({ length: 28 }),
      display_name: loremIpsum({
        sentenceUpperBound: 1,
        units: 'words',
        count: 1,
      }),
    });
  }

  await pool.query('DELETE FROM users');
  await pool.query(
    `INSERT INTO users (${db.getQueryColumns(users)}) VALUES ?`,
    [db.getQueryValues(users)],
  );

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

  const users = await getUsersFromDB(pool);

  for (let i = 0; i < 10000; i += 1) {
    posts.push({
      user_id: users[getRandomInt(users.length - 1)].id,
      old_image_url: DUMMY_IMAGES[getRandomInt(DUMMY_IMAGES.length - 1)],
      new_image_url: DUMMY_IMAGES[getRandomInt(DUMMY_IMAGES.length - 1)],
      description: loremIpsum(),
      shoot_date: new Date(
        getRandomInt(1527814486286, -2027814486286),
      ).toLocaleDateString(),
      lat: getRandomDouble(45, 30),
      lng: getRandomDouble(130, 145),
      view_count: getRandomInt(1000, 0),
    });
  }

  await pool.query('DELETE FROM posts');
  await pool.query(
    `INSERT INTO posts (${db.getQueryColumns(posts)}) VALUES ?`,
    [db.getQueryValues(posts)],
  );

  console.log('succeed addition of posts');
};

const setupDummyLikes = async () => {
  const users = await getUsersFromDB(pool);
  const posts = await getPostsFromDB(pool);
  const likes = [];

  let count = 0;
  const memory = {};

  while (count < 5000) {
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

  await pool.query('DELETE FROM likes');
  await pool.query(
    `INSERT INTO likes  (${db.getQueryColumns(likes)}) VALUES ?`,
    [db.getQueryValues(likes)],
  );

  console.log('succeed addition of likes');
};

const setupDummyComments = async () => {
  const users = await getUsersFromDB(pool);
  const posts = await getPostsFromDB(pool);

  const comments = [];

  for (let i = 0; i < 30000; i += 1) {
    comments.push({
      post_id: posts[getRandomInt(posts.length - 1)].id,
      user_id: users[getRandomInt(users.length - 1)].id,
      datetime: new Date(
        getRandomInt(1527814486286, 1027814486286),
      ).toLocaleString(),
      comment: loremIpsum(),
    });
  }

  await pool.query('DELETE FROM comments');
  await pool.query(
    `INSERT INTO comments (${db.getQueryColumns(comments)}) VALUES ?`,
    [db.getQueryValues(comments)],
  );

  console.log('succeed addition of comments');
};
