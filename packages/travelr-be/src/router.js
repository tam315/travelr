const AuthenticationController = require('./controllers/authentication');
const UsersController = require('./controllers/users');
const PostsController = require('./controllers/posts');

const { checkToken } = AuthenticationController;

module.exports = app => {
  // readiness status
  app.get('/readiness', (req, res) => res.send('ok'));

  // users
  app.post('/users', checkToken, UsersController.getOrCreateUser);
  app.get('/users/token', checkToken, UsersController.getUserByToken);
  app.get('/users/:userId', UsersController.getUser);
  app.put('/users/:userId', checkToken, UsersController.updateUser);
  app.delete('/users/:userId', checkToken, UsersController.deleteUser);

  // posts
  app.get('/posts', PostsController.getPosts);
  app.post('/posts', checkToken, PostsController.createPost);
  app.delete('/posts', checkToken, PostsController.deletePosts);
  app.get('/posts/stats', PostsController.stats);

  // posts - for specific post
  app.get('/posts/:postId', PostsController.getPost);
  app.put('/posts/:postId', checkToken, PostsController.updatePost);
  app.delete('/posts/:postId', checkToken, PostsController.deletePost);
  app.get('/posts/:postId/comments', PostsController.getComments);
  app.post(
    '/posts/:postId/comments',
    checkToken,
    PostsController.createComment,
  );
  app.post(
    '/posts/:postId/like/toggle',
    checkToken,
    PostsController.toggleLike,
  );
  app.post(
    '/posts/:postId/increment_view_count',
    PostsController.incrementViewCount,
  );

  // posts - comment creation and update
  app.put(
    '/posts/comments/:commentId',
    checkToken,
    PostsController.updateComment,
  );
  app.delete(
    '/posts/comments/:commentId',
    checkToken,
    PostsController.deleteComment,
  );
};
