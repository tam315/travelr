export const setGoogleMapsApiMock = () => {
  google = {
    maps: {
      LatLng: jest.fn(),
      Map: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
        panTo: jest.fn(),
        setZoom: jest.fn(),
      })),
      Marker: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
        setMap: jest.fn(),
        setPosition: jest.fn(),
      })),
      InfoWindow: jest.fn(),
    },
  };
  MarkerClusterer = jest.fn().mockImplementation(() => ({
    clearMarkers: jest.fn(),
  }));
};

export const deleteGoogleMapsApiMock = () => {
  google = undefined;
};
