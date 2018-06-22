import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import MapsHelper from '../utils/MapsHelper';

// header height is:
//   64px if the window width is same or bigger than 600px
//   56px if the window width is less than 600px
const headerHeight = window.innerWidth >= 600 ? 64 : 56;

const styles = {
  mapContainer: {
    // eliminate header height & tabs height
    height: `calc(100vh - ${headerHeight}px - 48px)`,
  },
};

const propTypes = {
  posts: PropTypes.array,
  classes: PropTypes.object.isRequired,
};

const defaultProps = {
  posts: [],
};

class PageViewPostsMap extends React.Component {
  constructor(props) {
    super(props);

    this.mapRef = React.createRef(); // div element for google maps
  }

  componentDidMount = () => {
    this.mapsHelper = new MapsHelper(this.mapRef.current);
    this.mapsHelper.placePosts(this.props.posts);
  };

  componentDidUpdate = () => {
    this.mapsHelper.placePosts(this.props.posts);
  };

  render = () => {
    const { classes } = this.props;
    return <div ref={this.mapRef} className={classes.mapContainer} />;
  };
}

PageViewPostsMap.propTypes = propTypes;
PageViewPostsMap.defaultProps = defaultProps;

export default withStyles(styles)(PageViewPostsMap);
