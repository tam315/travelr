DROP VIEW IF EXISTS get_posts;

CREATE VIEW get_posts AS

WITH
  -- total likes count for each post
  posts_likes AS (
    SELECT post_id, count(*)
    FROM likes
    GROUP BY post_id
  ),

  -- total comments count for each post
  posts_comments AS (
    SELECT post_id, count(*)
    FROM comments
    GROUP BY post_id
  )

SELECT
  posts.*,
  ST_X(geom) AS lng,
  ST_Y(geom) AS lat,
  users.display_name,
  posts_likes.count AS liked_count,
  posts_comments.count AS comments_count
FROM posts
LEFT OUTER JOIN users ON (posts.user_id = users.id)
LEFT OUTER JOIN posts_likes ON (posts.id = posts_likes.post_id)
LEFT OUTER JOIN posts_comments ON (posts.id = posts_comments.post_id)