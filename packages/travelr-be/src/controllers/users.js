const dbHelper = require('../helper/db');

const db = dbHelper.db;

exports.getOrCreateUser = async (req, res, next) => {
  const { userId } = req;
  const { displayName } = req.body;

  try {
    const userExists = await db.oneOrNone(
      'SELECT * FROM users WHERE id = $1',
      userId,
    );

    if (!userExists) {
      if (!displayName) return res.status(400).send('display name missing');

      await db.one(
        'INSERT INTO users (id, display_name) values ($1, $2) RETURNING *',
        [userId, displayName],
      );
    }

    const user = await db.one(
      'SELECT * FROM get_users WHERE id = $1 LIMIT 1',
      userId,
    );

    res.status(200).send({
      userId: user.id,
      displayName: user.display_name,
      isAdmin: user.is_admin,
      earnedViews: +user.earned_views,
      earnedLikes: +user.earned_likes,
      earnedComments: +user.earned_comments,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await db.oneOrNone(
      'SELECT * FROM get_users WHERE id = $1 LIMIT 1',
      userId,
    );

    if (!user) return res.status(400).send('user not found');

    res.status(200).send({
      userId: user.id,
      displayName: user.display_name,
      isAdmin: user.is_admin,
      earnedViews: +user.earned_views,
      earnedLikes: +user.earned_likes,
      earnedComments: +user.earned_comments,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateUser = async (req, res, next) => {
  const { userId } = req;
  const { displayName } = req.body;

  // check if the body is valid
  if (!displayName) return res.status(400).send('display name missing');

  // check if the param is valid
  const userIdParams = req.params.userId;
  if (userId !== userIdParams)
    return res.status(400).send("param doe's not match authenticated user");

  try {
    const user = await db.one(
      'UPDATE users SET display_name = $1 WHERE id = $2 RETURNING *',
      [displayName, userId],
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { userId } = req;

  // check if the param is valid
  const userIdParams = req.params.userId;
  if (userId !== userIdParams)
    return res.status(400).send("param doe's not match authenticated user");

  try {
    const user = await db.one(
      'DELETE FROM users WHERE id = $1 RETURNING *;',
      userId,
    );
    return res.sendStatus(200);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

exports.getUserByToken = async (req, res, next) => {
  const { userId } = req;
  const { token } = req.params;

  try {
    const user = await db.oneOrNone(
      'SELECT * FROM get_users WHERE id = $1 LIMIT 1',
      userId,
    );

    if (!user) return res.status(400).send('user not found');

    res.status(200).send({
      userId: user.id,
      displayName: user.display_name,
      isAdmin: user.is_admin,
      earnedViews: +user.earned_views,
      earnedLikes: +user.earned_likes,
      earnedComments: +user.earned_comments,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
