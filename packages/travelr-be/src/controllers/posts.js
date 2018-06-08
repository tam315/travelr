const pgPromise = require('pg-promise')();
const { db } = require('../helper/db');
const config = require('../../config');

exports.getPosts = async (req, res, next) => {
  const {
    user_id,
    display_name,
    description,
    min_date,
    max_date,
    lng,
    lat,
    radius,
    min_view_count,
    max_view_count,
    min_liked_count,
    max_liked_count,
    min_comments_count,
    max_comments_count,
  } = req.query;

  const criterions = [];

  if (user_id) {
    const criteria = pgPromise.as.format('user_id = $1', user_id);
    criterions.push(criteria);
  }

  if (display_name) {
    const criteria = pgPromise.as.format('display_name = $1', display_name);
    criterions.push(criteria);
  }

  if (description) {
    const criteria = pgPromise.as.format(
      'description like $1',
      `%${description}%`,
    );
    criterions.push(criteria);
  }

  if (min_date) {
    const criteria = pgPromise.as.format('shoot_date >= $1', min_date);
    criterions.push(criteria);
  }

  if (max_date) {
    const criteria = pgPromise.as.format('shoot_date <= $1', max_date);
    criterions.push(criteria);
  }

  if (lng && lat && radius) {
    const criteria = pgPromise.as.format(
      'ST_DWithin(geom, ST_GeomFromText($1), $2, true)',
      [`POINT(${lng} ${lat})`, +radius],
    );
    criterions.push(criteria);
  }

  if (max_view_count) {
    const criteria = pgPromise.as.format('view_count <= $1', +max_view_count);
    criterions.push(criteria);
  }

  if (min_view_count) {
    const criteria = pgPromise.as.format('view_count >= $1', +min_view_count);
    criterions.push(criteria);
  }

  if (max_liked_count) {
    const criteria = pgPromise.as.format('liked_count <= $1', +max_liked_count);
    criterions.push(criteria);
  }

  if (min_liked_count) {
    const criteria = pgPromise.as.format('liked_count >= $1', +min_liked_count);
    criterions.push(criteria);
  }

  if (max_comments_count) {
    const criteria = pgPromise.as.format(
      'comments_count <= $1',
      +max_comments_count,
    );
    criterions.push(criteria);
  }

  if (min_comments_count) {
    const criteria = pgPromise.as.format(
      'comments_count >= $1',
      +min_comments_count,
    );
    criterions.push(criteria);
  }

  let query = 'SELECT * FROM get_posts';

  if (criterions.length) {
    const whereQuery = ` WHERE ${criterions.join(' AND ')}`;
    query = query + whereQuery;
  }
  const posts = await db.manyOrNone(query);

  const response = posts.map(post => ({
    postId: post.id,
    userId: post.user_id,
    oldImageUrl: post.old_image_url,
    newImageUrl: post.new_image_url,
    description: post.description,
    shootDate: post.shoot_date,
    lng: post.lng,
    lat: post.lat,
    viewCount: post.view_count,
    displayName: post.display_name,
    likedCount: +post.liked_count,
    commentsCount: +post.comments_count,
  }));

  res.status(200).json(response);
};

exports.createPost = async (req, res, next) => {
  const { userId } = req;
  const {
    oldImageUrl,
    newImageUrl,
    description,
    shootDate,
    lng,
    lat,
  } = req.body;

  if (!(oldImageUrl && newImageUrl && shootDate && lng && lat))
    return res.status(400).send('Some key is missing in body');

  const post = {
    user_id: userId,
    old_image_url: oldImageUrl,
    new_image_url: newImageUrl,
    description,
    shoot_date: shootDate,
    geom: pgPromise.as.format('ST_GeomFromText($1, $2)', [
      `POINT(${lng} ${lat})`,
      config.SRID,
    ]),
  };

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
  ];
  const query = pgPromise.helpers.insert(post, column, 'posts');

  try {
    await db.one(`${query} ${'RETURNING *'}`);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
