// @flow
import config from '../config';
import loadJS from './loadJS';
import type { LatLng } from '../config/types';

declare var google: any;
declare var MarkerClusterer: any;
type Marker = { setMap: any => any, setPosition: any => any };

class MapsPickPosition {
  map: any; // reference to map instance
  marker: Marker; // reference marker instances
  callback: (position: LatLng) => any; // called when the pin position is changed

  constructor(mapRef: HTMLElement, callback: (position: LatLng) => any) {
    this.callback = callback;
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
    const latLng = new google.maps.LatLng(35.681235, 139.763995);

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
    this.marker.addListener('dragend', e => {
      const position: LatLng = { lng: e.latLng.lng(), lat: e.latLng.lat() };
      this.map.panTo(position);
      this.callback(position);
    });

    // on click
    this.map.addListener('click', e => {
      const position: LatLng = { lng: e.latLng.lng(), lat: e.latLng.lat() };
      this.marker.setPosition(position);
      this.map.panTo(position);
      this.callback(position);
    });
  };

  setPosition = (position: LatLng) => {
    this.marker.setPosition(position);
    this.map.panTo(position);
    this.map.setZoom(15);
  };
}

export default MapsPickPosition;
