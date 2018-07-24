import { CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { Link } from 'react-router-dom';
import { Post } from '../config/types';
import firebaseUtils from '../utils/firebaseUtils';
import StatusBadge from './StatusBadge';

const MAX_WIDTH = 528;

const styles = theme => ({
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
  circulator: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 4,
  },
});

type Props = {
  classes: any;
  posts: Post[];
  limitCountOfGrid: number;
  increaseLimitCountOfGrid: () => void;
};

class PageViewPostsGrid extends React.Component<Props> {
  // @ts-ignore
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

  renderLoadingNotification = () => {
    const { posts, limitCountOfGrid, classes } = this.props;
    if (limitCountOfGrid < posts.length) {
      return (
        <div className={classes.circulator}>
          <CircularProgress />
        </div>
      );
    }
  };

  render() {
    const { classes, posts, limitCountOfGrid } = this.props;

    if (!posts || !limitCountOfGrid) return;

    return (
      <div className={classes.root}>
        <div className={classes.grid}>{this.renderGridItems()}</div>

        {this.renderLoadingNotification()}
        <BottomScrollListener
          onBottom={this.handleOnBottom}
          debounce={0}
          offset={100}
        />
      </div>
    );
  }
}

// @ts-ignore
export default withStyles(styles)(PageViewPostsGrid);
