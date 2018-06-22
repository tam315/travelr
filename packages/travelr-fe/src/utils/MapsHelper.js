import config from '../config';
import loadJS from './loadJS';

class MapsHelper {
  constructor(mapRef) {
    this.isApiReady = false; // whether maps api is loaded and ready
    this.map = null; // reference to the maps div element
    this.markers = null; // reference marker instances
    this.markerCluster = null; // reference to the marker cluster
    this.infowindow = null; // reference to the info window which is currently opened
    this.queuedPosts = []; // pending tasks because map was not initialized

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
    this.isApiReady = true;
    mapInitializer();
  }

  mapInitializerGenerator = mapRef => () => {
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

    // this line should be here otherwise placeMarkers() fails
    // because placeMarkers() will be called before 'this.map' is set.
    this.isApiReady = true;

    // if there are pengind tasks, execute them.
    if (this.queuedPosts.length > 0) {
      this.placePosts(this.queuedPosts.pop());
      this.queuedPosts = [];
    }
  };

  closePreviousInfowindow = () => {
    if (this.infowindow) this.infowindow.close();
  };

  placePosts = posts => {
    // if api is not ready, queue posts and exit funtion
    if (!this.isApiReady) return this.queuedPosts.push(posts);

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
        marker.infowindow.open(this.map, marker);
      });

      return marker;
    });

    // a specific js library file is required for markerCluster. see index.html
    this.markerCluster = new MarkerClusterer(this.map, this.markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });

    return true;
  };
}

export default MapsHelper;
