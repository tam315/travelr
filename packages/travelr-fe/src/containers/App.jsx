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
import type { UserStore } from '../config/types';
import firebaseUtils from '../utils/firebaseUtils';

type Props = {
  fetchUserInfo: (user: UserStore) => void,
  getOrCreateUserInfo: (token: string, displayName?: string) => void,
  user: UserStore,
};

export class App extends React.Component<Props> {
  componentDidMount = () => {
    firebaseUtils.onAuthStateChanged((token, displayName) => {
      this.props.getOrCreateUserInfo(token, displayName);
    });
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
