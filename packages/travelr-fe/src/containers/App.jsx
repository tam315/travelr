// @flow
import CssBaseline from '@material-ui/core/CssBaseline'; // normalize styles
import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
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
import SnackbarService from '../components/SnackbarService';
import '../utils/firebaseUtils';
import type { UserStore } from '../config/types';
import firebase from 'firebase/app';

type Props = {
  fetchUserInfo: (user: UserStore) => void,
  getOrCreateUserInfo: (token: string, displayName?: 'string') => void,
  user: UserStore,
};

export class App extends React.Component<Props> {
  componentDidMount = async () => {
    try {
      // this function is called in the following cases:
      //   - case1: when unauthorized user successfully redirected from OAuth provider
      //   - case2: when authorized user reload / re-visit the page
      firebase.auth().onAuthStateChanged(async user => {
        const redirectResult = await firebase.auth().getRedirectResult();

        // case1
        if (user && redirectResult.user) {
          const token = await user.getIdToken();
          const displayName =
            redirectResult.additionalUserInfo.profile.given_name;

          this.props.getOrCreateUserInfo(token, displayName);
          return;
        }

        // case2
        if (user && !redirectResult.user) {
          const token = await user.getIdToken();

          this.props.getOrCreateUserInfo(token);
        }
      });
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        throw new Error(
          'このメールアドレスは別のログイン方法に紐づけされています',
        ); // TODO: link account, snackbar
      }
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
        <BrowserRouter>
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
        </BrowserRouter>
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
