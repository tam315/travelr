const dbHelper = require('../helper/db');

const db = dbHelper.db;

// TODO: authorization
exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await db.oneOrNone(
    'SELECT * FROM get_user WHERE id = $1 LIMIT 1',
    userId,
  );

  if (!user) return res.status(421).end();

  res.status(200).send({
    userId: user.id,
    displayName: user.display_name,
    isAdmin: user.is_admin,
    earnedViews: +user.earned_views,
    earnedLikes: +user.earned_likes,
    earnedComments: +user.earned_comments,
  });
};
