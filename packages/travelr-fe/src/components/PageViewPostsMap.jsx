import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import config from '../config';

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
    this.infowindow = null; // infowindow which is currently opened
    this.markers = null; // markers which is currently displayed
    this.markerCluster = null; // markerCluster which is currently displayed

    this.state = {
      isApiLoaded: false,
    };
  }

  componentDidMount = () => {
    // APIが読み込まれていない場合は読み込む。
    // Mapのインスタンス生成処理を、API読み込み後のコールバックとして指定し、
    // ファンクションを終了する。
    if (typeof google !== 'object' || !google.maps) {
      window.initGoogleMap = this.initGoogleMap;
      this.loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          config.googleMapApiKey
        }&libraries=visualization&callback=initGoogleMap`,
      );
      return;
    }

    // APIがすでに読み込まれている場合は重複して読み込まない。
    // Mapのインスタンス生成処理を行う。
    this.initGoogleMap();
  };

  componentDidUpdate = () => {
    if (this.state.isApiLoaded) this.placeMarkers();
  };

  initGoogleMap = () => {
    const gotsuCity = new google.maps.LatLng(35.011892, 132.221816);

    // create map
    this.map = new google.maps.Map(this.mapRef.current, {
      zoom: 5,
      center: gotsuCity,
    });

    // close infowindow when the map is clicked
    this.map.addListener('click', () => {
      this.closePreviousInfowindow();
    });

    // place markers
    this.placeMarkers();

    // this line should be here otherwise placeMarkers() fails
    // because placeMarkers() will be called before 'this.map' is set.
    this.setState({ isApiLoaded: true });
  };

  placeMarkers = () => {
    // remove previous markers
    if (this.markers) {
      this.markers.forEach(marker => {
        marker.setMap(null);
        // remove memory allocation
        marker.infowindow = null; /* eslint-disable-line */
        marker = null; /* eslint-disable-line */
      });
    }

    // remove previous markerCluster
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
      // remove memory allocation
      this.markerCluster = null;
    }

    const { posts } = this.props;

    this.markers = posts.map(post => {
      // marker for each post
      const position = new google.maps.LatLng(post.lat, post.lng);
      const marker = new google.maps.Marker({
        position,
        map: this.map,
      });

      // infowindow for each post
      // (attach to marker in order to remove memory allocation when marker is deleted)
      marker.infowindow = new google.maps.InfoWindow({
        content: `<img src="${post.oldImageUrl}" height="50" width="50" />`,
      });

      // show the infowindow for each post when the marker is cliked
      marker.addListener('click', () => {
        this.closePreviousInfowindow();
        // preserve to close infowindow
        this.infowindow = marker.infowindow;
        marker.infowindow.open(this.map, marker);
      });

      return marker;
    });

    // a specific js library file is required for markerCluster. see index.html
    this.markerCluster = new MarkerClusterer(this.map, this.markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });
  };

  closePreviousInfowindow = () => {
    if (this.infowindow) this.infowindow.close();
  };

  loadJS = src => {
    const ref = window.document.getElementsByTagName('script')[0];
    const script = window.document.createElement('script');
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  };

  render = () => {
    const { classes } = this.props;
    return <div ref={this.mapRef} className={classes.mapContainer} />;
  };
}

PageViewPostsMap.propTypes = propTypes;
PageViewPostsMap.defaultProps = defaultProps;

export default withStyles(styles)(PageViewPostsMap);
