export const setGoogleMapsApiMock = () => {
  // @ts-ignore
  google = {
    maps: {
      LatLng: jest.fn(),
      Map: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
        panTo: jest.fn(),
        setCenter: jest.fn(),
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
};

export const deleteGoogleMapsApiMock = () => {
  // @ts-ignore
  google = undefined;
};
