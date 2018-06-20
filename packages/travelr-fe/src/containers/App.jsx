import CssBaseline from '@material-ui/core/CssBaseline'; // normalize styles
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
import PageViewPostsGrid from '../components/PageViewPostsGrid';
import PageViewPostsMap from '../components/PageViewPostsMap';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <BrowserRouter>
          <React.Fragment>
            <Header {...this.props} />
            <Switch>
              <Route path="/" exact component={PageLanding} />
              <Route path="/auth" component={PageAuth} />
              <Route path="/all-grid" component={PageViewPostsGrid} />
              <Route path="/all-map" component={PageViewPostsMap} />
              <Route path="/post/create" component={PageCreatePost} />
              <Route path="/post/:postId/edit" component={PageEditPost} />
              <Route path="/post/:postId" component={PageViewPost} />
              <Route path="/account/posts" component={PageManagePosts} />
              <Route path="/account" exact component={PageManageAccount} />
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
