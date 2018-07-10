// @flow
import CssBaseline from '@material-ui/core/CssBaseline'; // normalize styles
import 'babel-polyfill';
import fetchIntercept from 'fetch-intercept';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { compose } from 'redux';
import actions from '../actions';
import Header from '../components/Header';
import PageAuth from '../components/PageAuth';
import PageCreatePost from '../components/PageCreatePost';
import PageEditPost from '../components/PageEditPost';
import PageLanding from '../components/PageLanding';
import PageManageAccount from '../components/PageManageAccount';
import PageManagePosts from '../components/PageManagePosts';
import PageViewPost from '../components/PageViewPost';
import PageViewPosts from '../components/PageViewPosts';
import ProgressService from '../components/ProgressService';
import SnackbarService from '../components/SnackbarService';
import firebaseUtils from '../utils/firebaseUtils';
import history from '../utils/history';
import type { UserStore, TaskName, AuthSeed } from '../config/types';

type Props = {
  fetchUserInfo: (user: UserStore) => void,
  getOrCreateUserInfo: (authSeed: AuthSeed) => void,
  startProgress: (taskName: TaskName) => void,
  finishProgress: (taskName: TaskName) => void,
  addSnackbarQueue: (message: string) => void,
  user: UserStore,
};

export class App extends React.Component<Props> {
  componentDidMount = async () => {
    // display progress bar for every fetch request
    fetchIntercept.register({
      request: (url, config) => {
        this.props.startProgress('fetch');
        return [url, config];
      },

      requestError: error => {
        this.props.finishProgress('fetch');
        return Promise.reject(error);
      },

      response: response => {
        this.props.finishProgress('fetch');
        return response;
      },

      responseError: error => {
        this.props.finishProgress('fetch');
        return Promise.reject(error);
      },
    });
    await this.handleAuthentication();
  };

  handleAuthentication = async () => {
    try {
      this.props.startProgress('signin');

      const redirectedUserInfo = await firebaseUtils.getRedirectResult();

      if (redirectedUserInfo) {
        this.props.getOrCreateUserInfo(redirectedUserInfo);
      } else {
        const currentUserInfo = await firebaseUtils.getCurrentUser();
        if (currentUserInfo) {
          this.props.getOrCreateUserInfo(currentUserInfo);
        }
      }

      this.props.finishProgress('signin');
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        // TODO: link account, snackbar
        this.props.addSnackbarQueue(
          'このメールアドレスは別のログイン方法に紐づけされています',
        );
      }
      this.props.finishProgress('signin');
      throw new Error(err);
    }
  };

  // these lines are inevitable.
  // inline functions shouldn't be used as Route's 'component' params.
  // this causes unexpected component unmount everytime props changes.
  // see: https://material-ui.com/guides/composition/#caveat-with-inlining
  renderPageAuth = (itemProps: any) => (
    <PageAuth {...itemProps} {...this.props} />
  );
  renderPageViewPosts = (itemProps: any) => (
    <PageViewPosts {...itemProps} {...this.props} />
  );
  renderPageCreatePost = (itemProps: any) => (
    <PageCreatePost {...itemProps} {...this.props} />
  );
  renderPageEditPost = (itemProps: any) => (
    <PageEditPost {...itemProps} {...this.props} />
  );
  renderPageViewPost = (itemProps: any) => (
    <PageViewPost {...itemProps} {...this.props} />
  );
  renderPageManagePosts = (itemProps: any) => (
    <PageManagePosts {...itemProps} {...this.props} />
  );
  renderPageManageAccount = (itemProps: any) => (
    <PageManageAccount {...itemProps} {...this.props} />
  );

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        {/* $FlowIgnore */}
        <SnackbarService {...this.props} />
        <ProgressService {...this.props} />

        {/* this should be 'Router' not 'BrowserRouter' to use custom history */}
        <Router history={history}>
          <React.Fragment>
            <Header {...this.props} />
            <Switch>
              <Route path="/" exact component={PageLanding} />
              <Route path="/auth" component={this.renderPageAuth} />
              <Route path="/all-grid" component={this.renderPageViewPosts} />
              <Route path="/all-map" component={this.renderPageViewPosts} />
              <Route
                path="/post/create"
                component={this.renderPageCreatePost}
              />
              <Route
                path="/post/:postId/edit"
                component={this.renderPageEditPost}
              />
              <Route path="/post/:postId" component={this.renderPageViewPost} />
              <Route
                path="/account/posts"
                component={this.renderPageManagePosts}
              />
              <Route
                path="/account"
                exact
                component={this.renderPageManageAccount}
              />
            </Switch>
          </React.Fragment>
        </Router>
      </React.Fragment>
    );
  }
}

// map everything to props
const mapStateToProps = state => state;
const mapDispatchToProps = actions;

export default compose(
  // withRouter, // react-router need this to work with redux
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(App);
