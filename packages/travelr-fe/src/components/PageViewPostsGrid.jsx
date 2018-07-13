// @flow
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import firebaseUtils from '../utils/firebaseUtils';
import BottomScrollListener from './BottomScrollListener';
import StatusBadge from './StatusBadge';
import type { Post } from '../config/types';

const MAX_WIDTH = 528;

const styles = {
  root: {
    maxWidth: MAX_WIDTH,
    margin: 'auto',
    overflow: 'hidden',
  },
  grid: {
    display: 'grid',
    gridGap: '2px',
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  gridItem: {
    position: 'relative',
    '& img': {
      height: '100%',
      objectFit: 'cover',
      width: '100%',
    },
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
    if (posts.length !== prevProps.posts.length) this.renderGridItems();
  };

  handleOnBottom = () => {
    const { increaseLimitCountOfGrid } = this.props;
    increaseLimitCountOfGrid();
  };

  renderGridItems = () => {
    const { classes, posts, limitCountOfGrid } = this.props;

    if (!posts || !limitCountOfGrid) return false;

    const limitedPosts = posts.slice(0, limitCountOfGrid);

    // number of columns in each row
    const COLS = 3;
    // make tiles the same height and width
    const cellHeight =
      window.innerWidth > MAX_WIDTH
        ? MAX_WIDTH / COLS
        : window.innerWidth / COLS;

    return limitedPosts.map(tile => (
      <Link
        key={tile.postId}
        className={classes.gridItem}
        to={`/post/${tile.postId}`}
        style={{ height: cellHeight }}
      >
        <img
          src={firebaseUtils.getImageUrl(tile.oldImageUrl, '96w')}
          alt={tile.description}
        />

        <div className={classes.likedCount}>
          <StatusBadge icon="like" count={tile.likedCount} size="small" />
        </div>
      </Link>
    ));
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.grid}>{this.renderGridItems()}</div>

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
