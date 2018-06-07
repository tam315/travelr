DROP VIEW IF EXISTS get_posts;

CREATE VIEW get_posts AS

SELECT
  posts.*,
  ST_X(geom) AS lng,
  ST_Y(geom) AS lat,
  users.display_name,
  stats_likes.liked_count,
  stats_comments.comments_count
FROM posts

-- join post owner's 'display_name'
LEFT OUTER JOIN (
  SELECT id, display_name FROM users
)
AS users
ON (posts.user_id = users.id)

-- join total 'likes' count for each post
LEFT OUTER JOIN (
  SELECT post_id, count(*) AS liked_count
  FROM likes
  GROUP BY post_id
)
AS stats_likes
ON (posts.id = stats_likes.post_id)

-- join total 'comments' count for each post
LEFT OUTER JOIN (
    SELECT post_id, count(*) AS comments_count
  FROM comments
  GROUP BY post_id
)
AS stats_comments
ON (posts.id = stats_comments.post_id)
