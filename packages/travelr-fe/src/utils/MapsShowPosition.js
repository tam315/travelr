// @flow
import config from '../config';
import loadJS from './loadJS';

declare var google: any;
declare var MarkerClusterer: any;
type Marker = { setMap(any): any };
type Position = {
  lng: number,
  lat: number,
};

class MapsShowPosition {
  map: any; // reference to map instance

  marker: Marker; // reference marker instances

  constructor(mapRef: HTMLElement, position: Position) {
    const mapInitializer = this.mapInitializerGenerator(mapRef, position);

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

  mapInitializerGenerator = (mapRef: HTMLElement, position: Position) => () => {
    const center = new google.maps.LatLng(position.lat, position.lng);

    // create map
    this.map = new google.maps.Map(mapRef, {
      center,
      zoom: 7,
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      position,
    });
  };
}

export default MapsShowPosition;
