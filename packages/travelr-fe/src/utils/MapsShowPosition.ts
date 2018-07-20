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

    // if API is not ready yet, pend tasks and exit constructor
    if (typeof google !== 'object') {
      // @ts-ignore
      window.mapInitializer = mapInitializer;
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
