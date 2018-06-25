import PropTypes from 'prop-types';
import React from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { withStyles } from '@material-ui/core/styles';
import StatusBadge from './StatusBadge';

const propTypes = {
  posts: PropTypes.array,
  classes: PropTypes.object.isRequired,
};

const defaultProps = {
  posts: [],
};

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

class PageViewPostsGrid extends React.Component {
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
            <GridListTile key={tile.postId}>
              <img src={tile.oldImageUrl} alt={tile.description} />

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

PageViewPostsGrid.propTypes = propTypes;
PageViewPostsGrid.defaultProps = defaultProps;

export default withStyles(styles)(PageViewPostsGrid);
