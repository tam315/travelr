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
    limit,
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
    radiusAsMeter = radius * 1000;

    const criteria = pgPromise.as.format(
      'ST_DWithin(geom, ST_GeomFromText($1), $2, true)',
      [`POINT(${lng} ${lat})`, +radiusAsMeter],
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

  if (limit) {
    const limitQuery = pgPromise.as.format(' LIMIT $1', +limit);
    query = query + limitQuery;
  }

  try {
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
      viewCount: +post.view_count,
      displayName: post.display_name,
      likedCount: +post.liked_count,
      commentsCount: +post.comments_count,
    }));

    res.status(200).json(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
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
    const createdPost = await db.one(`${query} RETURNING *`);
    const response = { postId: createdPost.id };
    res.status(200).json(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deletePosts = async (req, res, next) => {
  const { userId } = req;
  const postIds = req.body;

  if (!(postIds instanceof Array) || !postIds.length) {
    return res.status(400).send('post ids are missing in body');
  }

  try {
    const result = await db.many(
      'DELETE FROM posts WHERE user_id = $1 AND id IN ($2:csv) RETURNING *',
      [userId, postIds],
    );

    if (result.length < postIds.length)
      return res.status(400).send('some posts were not deleted');

    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  const { user_id } = req.query;

  try {
    // increment view_count
    const incrementedPost = await db.oneOrNone(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = $1 RETURNING *',
      postId,
    );

    // return 400 if the post not found
    if (!incrementedPost) return res.status(400).send('post not found');

    // get post
    const post = await db.one('SELECT * FROM get_posts WHERE id = $1', postId);

    // get comments
    const comments = await db.manyOrNone(
      'SELECT * FROM get_comments WHERE post_id = $1 ORDER BY datetime DESC',
      postId,
    );

    // get like status if user_id is provided as a query param
    let likeStatus;
    if (user_id) {
      const likes = await db.oneOrNone(
        'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
        [user_id, postId],
      );
      likeStatus = !!likes;
    }

    const commentsFormatted = comments.map(comment => ({
      commentId: comment.id,
      postId: comment.post_id,
      userId: comment.user_id,
      datetime: comment.datetime,
      comment: comment.comment,
      displayName: comment.display_name,
    }));

    const response = {
      postId: post.id,
      userId: post.user_id,
      oldImageUrl: post.old_image_url,
      newImageUrl: post.new_image_url,
      description: post.description,
      shootDate: post.shoot_date,
      lng: post.lng,
      lat: post.lat,
      viewCount: +post.view_count,
      displayName: post.display_name,
      likedCount: +post.liked_count,
      commentsCount: +post.comments_count,
      comments: commentsFormatted,
    };

    if (typeof likeStatus === 'boolean') {
      response.likeStatus = likeStatus;
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updatePost = async (req, res, next) => {
  const { userId } = req;
  const { postId } = req.params;
  const {
    oldImageUrl,
    newImageUrl,
    description,
    shootDate,
    lng,
    lat,
  } = req.body;

  const settings = [];

  if (oldImageUrl) {
    const setting = pgPromise.as.format('old_image_url = $1', oldImageUrl);
    settings.push(setting);
  }

  if (newImageUrl) {
    const setting = pgPromise.as.format('new_image_url = $1', newImageUrl);
    settings.push(setting);
  }

  if (description) {
    const setting = pgPromise.as.format('description = $1', description);
    settings.push(setting);
  }

  if (shootDate) {
    const setting = pgPromise.as.format('shoot_date = $1', shootDate);
    settings.push(setting);
  }

  if (lng && lat) {
    const setting = pgPromise.as.format('geom = ST_GeomFromText($1, $2)', [
      `POINT(${lng} ${lat})`,
      config.SRID,
    ]);
    settings.push(setting);
  }

  if (!settings.length) {
    return res.status(400).send('body missing');
  }

  const query = pgPromise.as.format(
    `UPDATE posts SET ${settings.join(
      ', ',
    )} WHERE user_id = $1 AND id = $2 RETURNING *`,
    [userId, postId],
  );

  try {
    await db.one(query);

    const post = await db.one('SELECT * FROM get_posts WHERE id = $1', postId);
    const response = {
      postId: post.id,
      userId: post.user_id,
      oldImageUrl: post.old_image_url,
      newImageUrl: post.new_image_url,
      description: post.description,
      shootDate: post.shoot_date,
      lng: post.lng,
      lat: post.lat,
      viewCount: +post.view_count,
      displayName: post.display_name,
      likedCount: +post.liked_count,
      commentsCount: +post.comments_count,
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deletePost = async (req, res, next) => {
  const { userId } = req;
  const { postId } = req.params;

  try {
    await db.one(
      'DELETE FROM posts WHERE user_id = $1 AND id = $2 RETURNING *',
      [userId, postId],
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getComments = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const comments = await db.manyOrNone(
      'SELECT * FROM get_comments WHERE post_id = $1',
      postId,
    );

    const response = comments.map(comment => ({
      commentId: comment.id,
      postId: comment.post_id,
      userId: comment.user_id,
      datetime: comment.datetime,
      comment: comment.comment,
      displayName: comment.display_name,
    }));

    res.status(200).json(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.createComment = async (req, res, next) => {
  const { userId } = req;
  const { postId } = req.params;
  const { comment } = req.body;

  if (!comment) return res.status(400).send('body missing');

  try {
    await db.one(
      'INSERT INTO comments(post_id, user_id, datetime, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [postId, userId, new Date().toISOString(), comment],
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.toggleLike = async (req, res, next) => {
  const { userId } = req;
  const { postId } = req.params;

  try {
    const exists = await db.oneOrNone(
      'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId],
    );

    let response;

    if (exists) {
      await db.one(
        'DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING *',
        [postId, userId],
      );
      response = { likeStatus: false };
    } else {
      await db.one(
        'INSERT INTO likes(post_id, user_id) VALUES ($1, $2) RETURNING *',
        [postId, userId],
      );
      response = { likeStatus: true };
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.incrementViewCount = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await db.one(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = $1 RETURNING *',
      postId,
    );
    const response = {
      viewCount: post.view_count,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateComment = async (req, res, next) => {
  const { userId } = req;
  const { commentId } = req.params;
  const { comment } = req.body;

  if (!comment) return res.status(400).send('body missing');

  const query = pgPromise.as.format(
    `UPDATE comments SET comment = $1 WHERE user_id = $2 AND id = $3 RETURNING *`,
    [comment, userId, commentId],
  );

  try {
    await db.one(query);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteComment = async (req, res, next) => {
  const { userId } = req;
  const { commentId } = req.params;

  try {
    const comment = await db.one(
      'DELETE FROM comments WHERE user_id = $1 AND id = $2 RETURNING *',
      [userId, commentId],
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
