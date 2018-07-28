DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

CREATE TABLE users
  (
    id           VARCHAR(28) PRIMARY KEY,
    display_name VARCHAR(45) NOT NULL,
    is_admin     BOOLEAN NOT NULL DEFAULT FALSE
  );

CREATE TABLE posts
  (
    id            SERIAL PRIMARY KEY,
    user_id       VARCHAR(28) NOT NULL REFERENCES users (id)
                    ON DELETE CASCADE ON UPDATE CASCADE,
    old_image_url VARCHAR(300) NOT NULL,
    new_image_url VARCHAR(300) NOT NULL,
    description   VARCHAR(500),
    shoot_date    DATE NOT NULL,
    geom          GEOMETRY(POINT) NOT NULL,
    view_count    INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX posts_geom_idx ON posts USING GIST (geom);

CREATE TABLE likes
  (
    post_id INT REFERENCES posts (id)
              ON DELETE CASCADE ON UPDATE CASCADE,
    user_id VARCHAR(28) REFERENCES users (id)
              ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(post_id, user_id)
  );

CREATE TABLE comments
  (
    id       SERIAL PRIMARY KEY,
    post_id  INT NOT NULL REFERENCES posts (id)
              ON DELETE CASCADE ON UPDATE CASCADE,
    user_id  VARCHAR(28) NOT NULL REFERENCES users (id)
              ON DELETE CASCADE ON UPDATE CASCADE,
    datetime TIMESTAMP NOT NULL,
    comment  VARCHAR(2000) NOT NULL
  );