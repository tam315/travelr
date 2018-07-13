// @flow
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import firebaseUtils from '../utils/firebaseUtils';
import StatusBadge from './StatusBadge';
import type { Post } from '../config/types';

const MAX_WIDTH = 528;

const styles = {
  root: {
    maxWidth: MAX_WIDTH,
    margin: 'auto',
    overflow: 'hidden',
  },
  likedCount: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
};

type Props = {
  posts: Array<Post>,
  classes: any,
};

class PageViewPostsGrid extends React.Component<Props> {
  renderPosts = () => {
    const { posts } = this.props;

    if (!posts) return false;

    return posts.map(post => <div key={post.postId}>{post.postId}</div>);
  };

  render() {
    const { posts, classes } = this.props;
    // number of columns in each row
    const COLS = 3;
    // make tiles the same height and width
    const cellHeight =
      window.innerWidth > MAX_WIDTH
        ? MAX_WIDTH / COLS
        : window.innerWidth / COLS;

    return (
      <div className={classes.root}>
        <GridList cellHeight={cellHeight} cols={COLS}>
          {posts.map(tile => (
            <GridListTile
              key={tile.postId}
              component={Link}
              to={`/post/${tile.postId}`}
            >
              <img
                src={firebaseUtils.getImageUrl(tile.oldImageUrl, '96w')}
                alt={tile.description}
              />

              <div className={classes.likedCount}>
                <StatusBadge icon="like" count={tile.likedCount} size="small" />
              </div>
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

export default withStyles(styles)(PageViewPostsGrid);
