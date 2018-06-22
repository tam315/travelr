import loadJS from './loadJS';
import config from '../config';

class MapsHelper {
  constructor(mapRef) {
    this.isApiReady = false; // whether maps api is loaded and ready
    this.map = null; // reference to the maps div element
    this.markers = null; // reference marker instances
    this.markerCluster = null; // reference to the marker cluster
    this.infowindow = null; // reference to the info window which is currently opened
    this.tasks = []; // pending tasks because map was not initialized

    // load the API if it is not loaded.
    // pass the callback to instantiate the map and exit the constructor.
    if (typeof google !== 'object' || !google.maps) {
      window.initGoogleMap = this.initGoogleMap(mapRef);
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          config.googleMapApiKey
        }&libraries=visualization&callback=initGoogleMap`,
      );
      return;
    }

    // instantiate the map if API is ready.
    this.isApiReady = true;
    this.initGoogleMap(mapRef);
  }

  initGoogleMap = mapRef => () => {
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
    if (this.tasks) this.tasks.forEach(task => task());
  };

  closePreviousInfowindow = () => {
    if (this.infowindow) this.infowindow.close();
  };

  placePosts = posts => {
    const task = () => {
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
    };

    // if API is not yet ready, pend task and execute it after the 'this.initGoogleMap()'
    if (this.isApiReady) {
      task();
    } else {
      this.tasks.push(task);
    }
  };
}

export default MapsHelper;
