import { Post, LatLng, MapZoomAndCenter } from '../config/types';
import firebaseUtils from '../utils/firebaseUtils';

declare var MarkerClusterer: any;

class MapsShowAllPosition {
  isApiAndMapReady: boolean = false; // whether API and a map instance is ready

  map: google.maps.Map; // reference to the maps div element

  markers: google.maps.Marker[] = []; // reference marker instances

  markerCluster: any; // reference to the marker cluster

  infowindow: google.maps.InfoWindow; // reference to the info window which is currently opened

  queuedPosts: Post[]; // pending tasks because map was not initialized

  onZoomOrCenterChange: (zoomAndCenter: MapZoomAndCenter) => void;

  constructor(
    mapRef: HTMLElement,
    option: {
      zoomAndCenter: MapZoomAndCenter;
      onPostClick: (postId: number) => void;
      onZoomOrCenterChange: (zoomAndCenter: MapZoomAndCenter) => void;
    },
  ) {
    const mapInitializer = this.mapInitializerGenerator(
      mapRef,
      option.zoomAndCenter,
    );

    // @ts-ignore
    window.mapsShowAllPositionOnPostClick = option.onPostClick;
    this.onZoomOrCenterChange = option.onZoomOrCenterChange;

    this.queuedPosts = null;

    // if API is not ready yet, pend tasks and exit constructor
    if (typeof google !== 'object') {
      // @ts-ignore
      window.mapInitializer = mapInitializer;
      return;
    }

    // instantiate the map if API is ready.
    mapInitializer();
  }

  mapInitializerGenerator = (
    mapRef: HTMLElement,
    zoomAndCenter: MapZoomAndCenter,
  ) => () => {
    // create map
    this.map = new google.maps.Map(mapRef, {
      ...zoomAndCenter,
      zoomControl: false,
      streetViewControl: false,
    });

    // close infowindow when the map is clicked
    this.map.addListener('click', () => {
      this.closePreviousInfowindow();
    });

    // save zoomlevel and center position continuously
    const getZoomAndCenter = (): MapZoomAndCenter => ({
      zoom: this.map.getZoom(),
      center: {
        lng: this.map.getCenter().lng(),
        lat: this.map.getCenter().lat(),
      },
    });
    this.map.addListener('idle', () =>
      this.onZoomOrCenterChange(getZoomAndCenter()),
    );

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
    if (this.infowindow) {
      this.infowindow.close();
      this.infowindow = null;
    }
  };

  placePosts = (posts: Post[]) => {
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

    const createContent = marker => {
      const srcOldImage = firebaseUtils.getImageUrl(
        marker.post.oldImageUrl,
        '96w',
      );
      const srcNewImage = firebaseUtils.getImageUrl(
        marker.post.newImageUrl,
        '96w',
      );
      return (
        `<img src="${srcOldImage}" height="96" width="96" ` +
        `onclick="window.mapsShowAllPositionOnPostClick(` +
        `${marker.post.postId})" />` +
        `<img src="${srcNewImage}" height="96" width="96" ` +
        `onclick="window.mapsShowAllPositionOnPostClick(` +
        `${marker.post.postId})" />`
      );
    };

    // create markers
    this.markers = posts.map(post => {
      // marker for each post
      const position = new google.maps.LatLng(post.lat, post.lng);
      const marker = new google.maps.Marker({
        position,
        // following custom properties can be called like `marker.post.***`
        // @ts-ignore
        post,
      });

      // show the infowindow for each post when the marker is cliked
      marker.addListener('click', () => {
        this.closePreviousInfowindow();

        const content = createContent(marker);

        // preserve the info window for later closing
        this.infowindow = new google.maps.InfoWindow();
        this.infowindow.setContent(content);
        this.infowindow.open(this.map, marker);
      });

      return marker;
    });

    // a specific js library file is required for markerCluster. see index.html
    this.markerCluster = new MarkerClusterer(this.map, this.markers, {
      maxZoom: 10,
      zoomOnClick: false,
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });

    // this.markerCluster.addListener('clusterclick', cluster => {
    //   const markers = cluster.getMarkers();
    //   const position = cluster.getCenter();
    //   const contents = createContent(markers);
    // });
  };
}

export default MapsShowAllPosition;
