DROP VIEW IF EXISTS get_user;

CREATE VIEW get_user AS

SELECT
  users.*,
  stats.earned_views,
  stats.earned_likes,
  stats.earned_comments
FROM users

-- join stats data for each user
LEFT OUTER JOIN (
  SELECT
    posts.user_id,
    sum(posts.view_count) AS earned_views,
    sum(stats_likes.earned_likes) as earned_likes,
    sum(stats_comments.earned_comments) as earned_comments
  FROM posts

  -- join total 'likes' count for each post
  LEFT OUTER JOIN (
    SELECT likes.post_id, count(*) AS earned_likes
    FROM likes
    GROUP BY post_id
  )
  AS stats_likes
  ON (posts.id = stats_likes.post_id)

  -- join total 'comments' count for each post
  LEFT OUTER JOIN (
      SELECT comments.post_id, count(*) AS earned_comments
    FROM comments
    GROUP BY post_id
  )
  AS stats_comments
  ON (posts.id = stats_comments.post_id)

  GROUP BY posts.user_id
)
AS stats
ON users.id = stats.user_id;