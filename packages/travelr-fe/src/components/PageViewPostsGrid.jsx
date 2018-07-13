// @flow
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import firebaseUtils from '../utils/firebaseUtils';
import StatusBadge from './StatusBadge';
import type { Post } from '../config/types';
import BottomScrollListener from './BottomScrollListener';

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
  classes: any,
  posts: Array<Post>,
  limitCountOfGrid: number,
  increaseLimitCountOfGrid: void => void,
};

class PageViewPostsGrid extends React.Component<Props> {
  componentDidUpdate = prevProps => {
    // render grids if fetching posts done
    const { posts } = this.props;
    if (posts.length !== prevProps.posts.length) this.renderPosts();
  };

  handleOnBottom = () => {
    const { increaseLimitCountOfGrid } = this.props;
    increaseLimitCountOfGrid();
  };

  renderPosts = () => {
    const { classes, posts, limitCountOfGrid } = this.props;

    if (!posts || !limitCountOfGrid) return false;

    const limitedPosts = posts.slice(0, limitCountOfGrid);

    return limitedPosts.map(tile => (
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
    ));
  };

  render() {
    const { classes } = this.props;

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
          {this.renderPosts()}
        </GridList>
        <div>Loading.....</div>
        <BottomScrollListener
          onBottom={this.handleOnBottom}
          debounce={0}
          offset={100}
        />
      </div>
    );
  }
}

export default withStyles(styles)(PageViewPostsGrid);
