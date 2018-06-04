const pool = require('../helper/db').createPool();

exports.getUser = async (req, res, next) => {
  const { userId } = req.params;
  const user = await pool.query(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    userId,
  );
  res.status(200).send({
    userId: user[0].id,
    displayName: user[0].display_name,
  });
};
