// @flow
import config from '../config';
import loadJS from './loadJS';
import type { LatLng } from '../config/types';

declare var google: any;
declare var MarkerClusterer: any;
type Marker = { setMap: any => any, setPosition: any => any };

class MapsPickPosition {
  callback: (position: LatLng) => any; // called when the pin position is changed
  defaultPosition: LatLng;
  handleMapClick: any => any;
  handleMarkerDragend: any => any;
  map: any; // reference to map instance
  marker: Marker; // reference marker instances

  constructor(
    mapRef: HTMLElement,
    callback: (position: LatLng) => any,
    options?: {
      defaultPosition?: LatLng,
    },
  ) {
    this.callback = callback;

    const defaultPosition = options && options.defaultPosition;

    this.defaultPosition = {
      lat: (defaultPosition && defaultPosition.lat) || 35.681235,
      lng: (defaultPosition && defaultPosition.lng) || 139.763995,
    };

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
    const { lat, lng } = this.defaultPosition;
    const latLng = new google.maps.LatLng(lat, lng);

    // create map
    this.map = new google.maps.Map(mapRef, {
      center: latLng,
      zoom: 5,
    });

    // create marker
    this.marker = new google.maps.Marker({
      map: this.map,
      position: latLng,
      draggable: true,
    });

    // on drag
    this.handleMarkerDragend = e => {
      const position: LatLng = { lng: e.latLng.lng(), lat: e.latLng.lat() };
      this.map.panTo(position);
      this.callback(position);
    };
    this.marker.addListener('dragend', this.handleMarkerDragend);

    // on click
    this.handleMapClick = e => {
      const position: LatLng = { lng: e.latLng.lng(), lat: e.latLng.lat() };
      this.marker.setPosition(position);
      this.map.panTo(position);
      this.callback(position);
    };
    this.map.addListener('click', this.handleMapClick);
  };

  setPosition = (position: LatLng) => {
    this.marker.setPosition(position);
    this.map.panTo(position);
    this.map.setZoom(15);
  };
}

export default MapsPickPosition;
