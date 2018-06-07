const dbHelper = require('../helper/db');

const db = dbHelper.db;

exports.getPosts = async (req, res, next) => {
  const posts = await db.manyOrNone('SELECT * FROM get_posts');

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
