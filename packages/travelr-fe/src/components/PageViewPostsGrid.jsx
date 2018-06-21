import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  posts: PropTypes.array,
};

const defaultProps = {
  posts: [],
};

export default class PageViewPostsGrid extends React.Component {
  renderPosts = () => {
    const { posts } = this.props;

    if (!posts) return false;

    return posts.map(post => <div key={post.postId}>{post.postId}</div>);
  };

  render() {
    return <div>{this.renderPosts()}</div>;
  }
}

PageViewPostsGrid.propTypes = propTypes;
PageViewPostsGrid.defaultProps = defaultProps;
