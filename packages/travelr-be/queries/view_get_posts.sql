DROP VIEW IF EXISTS get_posts;

CREATE VIEW get_posts AS

WITH
  -- calculate likes counts for each post_id
  stats_likes AS (
    SELECT post_id, count(*) AS liked_count
    FROM likes
    GROUP BY post_id
  ),

  -- calculate comments counts for each post_id
  stats_comments AS (
    SELECT post_id, count(*) AS comments_count
    FROM comments
    GROUP BY post_id
  )

SELECT
  posts.*,
  ST_X(geom) AS lng,
  ST_Y(geom) AS lat,
  users.display_name,
  stats_likes.liked_count,
  stats_comments.comments_count
FROM posts
LEFT OUTER JOIN users ON (posts.user_id = users.id)
LEFT OUTER JOIN stats_likes ON (posts.id = stats_likes.post_id)
LEFT OUTER JOIN stats_comments ON (posts.id = stats_comments.post_id)