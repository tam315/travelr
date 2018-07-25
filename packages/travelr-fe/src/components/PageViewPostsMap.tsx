import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Post, LatLng, AppStore, MapZoomAndCenter } from '../config/types';
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
  app: AppStore;
  posts: Post[];
  classes: any;
  saveMapZoomAndCenter: (zoomAndCenter: MapZoomAndCenter) => void;
};

export class PageViewPostsMap extends React.Component<Props> {
  mapRef: React.RefObject<HTMLDivElement>;

  mapsShowAllPosition: MapsShowAllPosition;

  constructor(props: Props) {
    super(props);

    this.mapRef = React.createRef(); // div element for google maps
  }

  // @ts-ignore
  componentDidMount = () => {
    const { posts, saveMapZoomAndCenter, app } = this.props;
    const onPostClick = postId => history.push(`/post/${postId}`);

    const zoomAndCenter: MapZoomAndCenter = {
      zoom: app.mapZoomLevel,
      center: {
        lng: app.mapLng,
        lat: app.mapLat,
      },
    };

    if (this.mapRef.current) {
      this.mapsShowAllPosition = new MapsShowAllPosition(this.mapRef.current, {
        onPostClick,
        zoomAndCenter,
        onZoomOrCenterChange: saveMapZoomAndCenter,
      });
      this.mapsShowAllPosition.placePosts(posts);
    }
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

  // @ts-ignore
  render = () => {
    const { classes } = this.props;
    return <div ref={this.mapRef} className={classes.mapContainer} />;
  };
}

export default withStyles(styles)(PageViewPostsMap);
