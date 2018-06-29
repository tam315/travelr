// @flow
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import MapsHelper from '../utils/MapsHelper';
import type { Post } from '../config/types';

type ReactObjRef<ElementType: React.ElementType> = {
  current: null | React.ElementRef<ElementType>,
};

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

type Props = {
  posts: Array<Post>,
  classes: any,
};

class PageViewPostsMap extends React.Component<Props> {
  mapRef: ReactObjRef<'div'>;
  mapsHelper: MapsHelper;

  constructor(props: Props) {
    super(props);

    this.mapRef = React.createRef(); // div element for google maps
  }

  componentDidMount = () => {
    if (this.mapRef.current) {
      this.mapsHelper = new MapsHelper(this.mapRef.current);
      this.mapsHelper.placePosts(this.props.posts);
    }
  };

  componentDidUpdate = () => {
    this.mapsHelper.placePosts(this.props.posts);
  };

  render = () => {
    const { classes } = this.props;
    return <div ref={this.mapRef} className={classes.mapContainer} />;
  };
}

export default withStyles(styles)(PageViewPostsMap);
