import { CssBaseline } from '@material-ui/core'; // normalize styles
import 'babel-polyfill';
import fetchIntercept from 'fetch-intercept';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { compose } from 'redux';
import actions from '../actions';
import DialogService from '../components/DialogService';
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
import config from '../config';
import { AppStore, UserStore } from '../config/types';
import { loadJS } from '../utils/general';
import history from '../utils/history';

type Props = {
  initAuth: () => any;
  startProgress: () => void;
  finishProgress: () => void;
  app: AppStore;
  user: UserStore;
};

export class App extends React.Component<Props> {
  // @ts-ignore
  componentDidMount = async () => {
    const { startProgress, finishProgress, initAuth } = this.props;

    // load google maps API. mapInitializer is dummy, and
    // may already exists or be overwritten by the other component
    if (!window.mapInitializer) window.mapInitializer = () => {};

    loadJS(
      `https://maps.googleapis.com/maps/api/js?key=${
        config.googleMapApiKey
      }&libraries=visualization&callback=mapInitializer`,
    );

    // display progress bar for every fetch request
    fetchIntercept.register({
      request: (url, config) => {
        startProgress();
        return [url, config];
      },

      requestError: error => {
        finishProgress();
        return Promise.reject(error);
      },

      response: response => {
        finishProgress();
        return response;
      },

      responseError: error => {
        finishProgress();
        return Promise.reject(error);
      },
    });

    initAuth();
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
        {
          // @ts-ignore
          <SnackbarService {...this.props} />
        }
        {
          // @ts-ignore
          <DialogService {...this.props} />
        }
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
