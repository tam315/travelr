import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Post } from '../config/types';
import history from '../utils/history';
import MapsShowAllPosition from '../utils/MapsShowAllPosition';

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
  posts: Post[];
  classes: any;
};

class PageViewPostsMap extends React.Component<Props> {
  mapRef: React.RefObject<HTMLDivElement>;

  mapsShowAllPosition: MapsShowAllPosition;

  constructor(props: Props) {
    super(props);

    this.mapRef = React.createRef(); // div element for google maps
  }

  // @ts-ignore
  componentDidMount = () => {
    const { posts } = this.props;
    const onPostClick = postId => history.push(`/post/${postId}`);

    if (this.mapRef.current) {
      this.mapsShowAllPosition = new MapsShowAllPosition(
        this.mapRef.current,
        onPostClick,
      );
      this.mapsShowAllPosition.placePosts(posts);
    }
  };

  // @ts-ignore
  componentDidUpdate = () => {
    const { posts } = this.props;
    this.mapsShowAllPosition.placePosts(posts);
  };

  // @ts-ignore
  render = () => {
    const { classes } = this.props;
    return <div ref={this.mapRef} className={classes.mapContainer} />;
  };
}

export default withStyles(styles)(PageViewPostsMap);
