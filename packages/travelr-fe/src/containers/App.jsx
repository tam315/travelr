import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as actions from '../actions';
import PageAuth from '../components/PageAuth';
import PageCreatePost from '../components/PageCreatePost';
import PageEditPost from '../components/PageEditPost';
import PageLanding from '../components/PageLanding';
import PageManageAccount from '../components/PageManageAccount';
import PageManagePosts from '../components/PageManagePosts';
import PageViewPost from '../components/PageViewPost';
import PageViewPostsGrid from '../components/PageViewPostsGrid';
import PageViewPostsMap from '../components/PageViewPostsMap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline'; // normalize styles
import Header from '../components/Header';

// ...this.propsを子コンポーネントに渡すことで、
// すべてのreduxのstoreとactionを子コンポーネントにおいて使えるようにする。
//
// ...propsを渡すことで、react-router関連のオブジェクト
// （history, location, match）を子コンポーネントにおいて使えるようにする。
class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header {...this.props} />
        <BrowserRouter>
          <Switch>
            <Route
              path="/"
              exact
              component={props => <PageLanding {...this.props} {...props} />}
            />
            <Route
              path="/auth"
              component={props => <PageAuth {...this.props} {...props} />}
            />
            <Route
              path="/all-grid"
              component={props => (
                <PageViewPostsGrid {...this.props} {...props} />
              )}
            />
            <Route
              path="/all-map"
              component={props => (
                <PageViewPostsMap {...this.props} {...props} />
              )}
            />
            <Route
              path="/post/create"
              component={props => <PageCreatePost {...this.props} {...props} />}
            />
            <Route
              path="/post/:postId/edit"
              component={props => <PageEditPost {...this.props} {...props} />}
            />
            <Route
              path="/post/:postId"
              component={props => <PageViewPost {...this.props} {...props} />}
            />
            <Route
              path="/account/posts"
              component={props => (
                <PageManagePosts {...this.props} {...props} />
              )}
            />
            <Route
              path="/account"
              exact
              component={props => (
                <PageManageAccount {...this.props} {...props} />
              )}
            />
          </Switch>
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
