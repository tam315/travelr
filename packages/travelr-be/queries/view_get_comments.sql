DROP VIEW IF EXISTS get_comments;

CREATE VIEW get_comments AS

SELECT
  comments.*,
  users.display_name
FROM comments
LEFT OUTER JOIN users ON (comments.user_id = users.id)