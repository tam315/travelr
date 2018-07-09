// @flow
import config from '../config';
import loadJS from './loadJS';
import type { Post } from '../config/types';

declare var google: any;
declare var MarkerClusterer: any;
type Marker = { setMap(any): any };

class MapsShowAllPosition {
  isApiAndMapReady: boolean = false; // whether API and a map instance is ready
  map: HTMLElement; // reference to the maps div element
  markers: Array<Marker> = []; // reference marker instances
  markerCluster: any; // reference to the marker cluster
  infowindow: any; // reference to the info window which is currently opened
  queuedPosts: ?Array<Post>; // pending tasks because map was not initialized

  constructor(mapRef: HTMLElement) {
    this.queuedPosts = null;

    const mapInitializer = this.mapInitializerGenerator(mapRef);

    // load the API if it is not loaded.
    // pass the callback to initialize the map.
    if (typeof google !== 'object') {
      window.mapInitializer = mapInitializer;
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          config.googleMapApiKey
        }&libraries=visualization&callback=mapInitializer`,
      );
      // exit constructor
      return;
    }

    // instantiate the map if API is ready.
    mapInitializer();
  }

  mapInitializerGenerator = (mapRef: HTMLElement) => () => {
    const gotsuCity = new google.maps.LatLng(35.011892, 132.221816);
    // create map
    this.map = new google.maps.Map(mapRef, {
      zoom: 5,
      center: gotsuCity,
    });

    // close infowindow when the map is clicked
    this.map.addListener('click', () => {
      this.closePreviousInfowindow();
    });

    // this line should be here (not top of this func)
    // otherwise placeMarkers() fails
    // as placeMarkers() will be called before 'this.map' is set.
    this.isApiAndMapReady = true;

    // if there are pengind tasks, execute them.
    if (this.queuedPosts) {
      this.placePosts(this.queuedPosts);
      this.queuedPosts = null;
    }
  };

  closePreviousInfowindow = () => {
    if (this.infowindow) this.infowindow.close();
  };

  placePosts = (posts: Array<Post>) => {
    // if api is not ready, queue posts and exit funtion
    if (!this.isApiAndMapReady) {
      this.queuedPosts = posts;
      return;
    }

    // remove previous markers
    if (this.markers.length) {
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
    }

    // remove previous markerCluster
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
      // remove memory allocation
      this.markerCluster = null;
    }

    // create markers
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
        // preserve the info window for later closing
        this.infowindow = marker.infowindow;
        this.infowindow.open(this.map, marker);
      });

      return marker;
    });

    // a specific js library file is required for markerCluster. see index.html
    this.markerCluster = new MarkerClusterer(this.map, this.markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });
  };
}

export default MapsShowAllPosition;
