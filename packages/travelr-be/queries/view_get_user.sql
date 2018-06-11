DROP VIEW IF EXISTS get_users;

CREATE VIEW get_users AS

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
  ),

  -- bind above stats data to each posts.
  -- then, group by user_id and get stats for each user.
  stats AS (
    SELECT
      user_id,
      sum(posts.view_count) AS earned_views,
      sum(posts_likes.count) as earned_likes,
      sum(posts_comments.count) as earned_comments
    FROM posts
    LEFT OUTER JOIN posts_likes ON (posts.id = posts_likes.post_id)
    LEFT OUTER JOIN posts_comments ON (posts.id = posts_comments.post_id)
    GROUP BY user_id
  )

SELECT
  users.*,
  stats.earned_views,
  stats.earned_likes,
  stats.earned_comments
FROM users
LEFT OUTER JOIN stats ON (users.id = stats.user_id)
