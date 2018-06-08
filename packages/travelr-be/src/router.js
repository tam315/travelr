const AuthenticationController = require('./controllers/authentication');
const UsersController = require('./controllers/users');
const PostsController = require('./controllers/posts');

const { checkToken } = AuthenticationController;

module.exports = app => {
  app.post('/users', checkToken, UsersController.createUser);
  app.get('/users/:userId', UsersController.getUser);
  app.put('/users/:userId', checkToken, UsersController.updateUser);
  app.delete('/users/:userId', checkToken, UsersController.deleteUser);
  app.get('/posts', PostsController.getPosts);
  app.post('/posts', checkToken, PostsController.createPost);
  app.delete('/posts', checkToken, PostsController.deletePosts);
};
