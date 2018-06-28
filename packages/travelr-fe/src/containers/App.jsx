import CssBaseline from '@material-ui/core/CssBaseline'; // normalize styles
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import 'babel-polyfill';
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

const propTypes = {
  fetchUserInfo: PropTypes.func.isRequired,
};

class App extends React.Component {
  componentDidMount = () => {
    this.props.fetchUserInfo('dummy_token'); // TODO: get from local storage
  };

  // these lines are inevitable.
  // inline functions shouldn't be used as Route's 'component' params.
  // this causes unexpected component unmount everytime props changes.
  // see: https://material-ui.com/guides/composition/#caveat-with-inlining
  renderPageViewPosts = itemProps => (
    <PageViewPosts {...itemProps} {...this.props} />
  );
  renderPageCreatePost = itemProps => (
    <PageCreatePost {...itemProps} {...this.props} />
  );
  renderPageViewPost = itemProps => (
    <PageViewPost {...itemProps} {...this.props} />
  );
  renderPageManagePosts = itemProps => (
    <PageManagePosts {...itemProps} {...this.props} />
  );
  renderPageManageAccount = itemProps => (
    <PageManageAccount {...itemProps} {...this.props} />
  );

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <SnackbarService {...this.props} />
        <BrowserRouter>
          <React.Fragment>
            <Header {...this.props} />
            <Switch>
              <Route path="/" exact component={PageLanding} />
              <Route path="/auth" component={PageAuth} />
              <Route path="/all-grid" component={this.renderPageViewPosts} />
              <Route path="/all-map" component={this.renderPageViewPosts} />
              <Route
                path="/post/create"
                component={this.renderPageCreatePost}
              />
              <Route path="/post/:postId/edit" component={PageEditPost} />
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

App.propTypes = propTypes;

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
