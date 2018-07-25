import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { AppStore, MapZoomAndCenter, Post } from '../config/types';
import MapsShowAllPosition from '../utils/MapsShowAllPosition';
import PageViewPostsMapDetail from './PageViewPostsMapDetail';

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
  app: AppStore;
  posts: Post[];
  classes: any;
  saveMapZoomAndCenter: (zoomAndCenter: MapZoomAndCenter) => void;
};

type State = {
  detailedPosts: Post[];
};

export class PageViewPostsMap extends React.Component<Props, State> {
  state = {
    // posts currently displayed in modal
    detailedPosts: [],
  };

  mapRef: React.RefObject<HTMLDivElement>;

  mapsShowAllPosition: MapsShowAllPosition;

  constructor(props: Props) {
    super(props);

    this.mapRef = React.createRef(); // div element for google maps
  }

  // @ts-ignore
  componentDidMount = () => {
    const { posts, saveMapZoomAndCenter, app } = this.props;

    const zoomAndCenter: MapZoomAndCenter = {
      zoom: app.mapZoomLevel,
      center: {
        lng: app.mapLng,
        lat: app.mapLat,
      },
    };

    this.mapsShowAllPosition = new MapsShowAllPosition(this.mapRef.current, {
      zoomAndCenter,
      onPinClick: this.handlePinClick,
      onClusterClick: this.handleClusterClick,
      onZoomOrCenterChange: saveMapZoomAndCenter,
    });
    this.mapsShowAllPosition.placePosts(posts);
  };

  // @ts-ignore
  componentDidUpdate = (prevProps: Props) => {
    const { posts, app } = this.props;
    if (JSON.stringify(posts) !== JSON.stringify(prevProps.posts)) {
      this.mapsShowAllPosition.placePosts(posts);
    }

    // when UPDATE_MAP_ZOOM_AND_CENTER_SUCCESS
    if (
      app.mapLatUpdated !== prevProps.app.mapLatUpdated ||
      app.mapLngUpdated !== prevProps.app.mapLngUpdated ||
      app.mapZoomLevelUpdated !== prevProps.app.mapZoomLevelUpdated
    ) {
      this.mapsShowAllPosition.updateZoomAndCenter({
        lat: app.mapLatUpdated,
        lng: app.mapLngUpdated,
        zoomLevel: app.mapZoomLevelUpdated,
      });
    }
  };

  handlePinClick = post => this.setState({ detailedPosts: [post] });

  handleClusterClick = posts => this.setState({ detailedPosts: [...posts] });

  handleDetailClose = () => {
    this.setState({
      detailedPosts: [],
    });
  };

  // @ts-ignore
  render = () => {
    const { classes } = this.props;
    const { detailedPosts } = this.state;

    return (
      <React.Fragment>
        <div ref={this.mapRef} className={classes.mapContainer} />
        <PageViewPostsMapDetail
          posts={detailedPosts}
          onClose={this.handleDetailClose}
        />
      </React.Fragment>
    );
  };
}

export default withStyles(styles)(PageViewPostsMap);
