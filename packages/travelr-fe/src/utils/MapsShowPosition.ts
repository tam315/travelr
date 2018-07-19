import config from '../config';
import { loadJS } from './general';

type Position = {
  lng: number;
  lat: number;
};

declare global {
  interface Window {
    mapInitializer: any;
  }
}

class MapsShowPosition {
  map: google.maps.Map; // reference to map instance

  marker: google.maps.Marker; // reference marker instances

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
      position,
      map: this.map,
    });
  };
}

export default MapsShowPosition;
