import { loadJS } from '../general';
import MapsPickPosition from '../MapsPickPosition';
import { deleteGoogleMapsApiMock, setGoogleMapsApiMock } from '../testHelper';

jest.mock('../general');

const DUMMY_POSITION = { lng: 135.0, lat: 35.0 };
const mockCallback = jest.fn();

describe('MapsPickPosition', () => {
  let mapRef;

  beforeEach(() => {
    jest.clearAllMocks();

    document.body.innerHTML =
      '<div>' +
      '  <script />' +
      '  <span id="username" />' +
      '  <button id="button" />' +
      '  <div id="maps" />' +
      '</div>';

    mapRef = document.getElementById('maps');
  });

  afterEach(() => {
    deleteGoogleMapsApiMock();
  });

  test("loads API file if it's not ready", () => {
    // eslint-disable-next-line
    const mapsPickPosition = new MapsPickPosition(mapRef, mockCallback);

    expect(loadJS).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(loadJS.mock.calls[0][0]).toContain('maps.googleapis.com/maps/api/');
  });

  test('initialize the maps if the API is already available', () => {
    setGoogleMapsApiMock();
    // eslint-disable-next-line
    const mapsPickPosition = new MapsPickPosition(mapRef, mockCallback);

    expect(google.maps.Map).toHaveBeenCalledTimes(1);
  });

  test('marker is created immediately if the API is already available', () => {
    setGoogleMapsApiMock();
    // eslint-disable-next-line
    const mapsPickPosition = new MapsPickPosition(mapRef, mockCallback);

    // markers created immediately each time
    expect(google.maps.Marker).toHaveBeenCalledTimes(1);
  });

  test('marker creation is queued until the API an map instance is ready', () => {
    const mapsPickPosition = new MapsPickPosition(mapRef, mockCallback);

    expect(google).toBe(undefined);

    // simulates the state where the API is ready
    setGoogleMapsApiMock();
    mapsPickPosition.mapInitializerGenerator(mapRef)();

    // map should be created
    expect(google.maps.Map).toHaveBeenCalledTimes(1);

    // marker should be created for the lastly queued posts
    expect(google.maps.Marker).toHaveBeenCalledTimes(1);
  });

  test('default position is set properly (if position is NOT provided)', () => {
    const mapsPickPosition = new MapsPickPosition(mapRef, mockCallback);

    expect(mapsPickPosition.defaultPosition).toEqual({
      lat: 35.681235,
      lng: 139.763995,
    });
  });

  test('default position is set properly (if position IS provided)', () => {
    setGoogleMapsApiMock();
    const options = {
      defaultPosition: DUMMY_POSITION,
    };
    const mapsPickPosition = new MapsPickPosition(
      mapRef,
      mockCallback,
      options,
    );

    expect(mapsPickPosition.defaultPosition).toEqual({
      lat: options.defaultPosition.lat,
      lng: options.defaultPosition.lng,
    });

    expect(google.maps.LatLng).toBeCalledWith(
      DUMMY_POSITION.lat,
      DUMMY_POSITION.lng,
    );
  });

  test('map is created on proper position', () => {
    setGoogleMapsApiMock();
    const options = {
      defaultPosition: { lat: 10.0, lng: 100.0 },
    };
    // eslint-disable-next-line
    const mapsPickPosition = new MapsPickPosition(
      mapRef,
      mockCallback,
      options,
    );

    expect(google.maps.LatLng).toBeCalledWith(10.0, 100.0);
  });

  test('callback is called on itinial setup', () => {
    // eslint-disable-next-line
    const mapsPickPosition = new MapsPickPosition(mapRef, mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('callback is called if pin is dragged', () => {
    setGoogleMapsApiMock();
    const mapsPickPosition = new MapsPickPosition(mapRef, mockCallback);

    const mockEvent = {
      latLng: {
        lng: () => 135.0,
        lat: () => 35.0,
      },
    };

    mapsPickPosition.handleMarkerDragend(mockEvent);

    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toBeCalledWith({ lng: 135.0, lat: 35.0 });
  });

  test('callback is called if map is clicked', () => {
    setGoogleMapsApiMock();
    const mapsPickPosition = new MapsPickPosition(mapRef, mockCallback);

    const mockEvent = {
      latLng: {
        lng: () => 135.0,
        lat: () => 35.0,
      },
    };

    mapsPickPosition.handleMapClick(mockEvent);

    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toBeCalledWith({ lng: 135.0, lat: 35.0 });
  });

  test('can set position', () => {
    setGoogleMapsApiMock();
    const mapsPickPosition = new MapsPickPosition(mapRef, mockCallback);

    jest.spyOn(mapsPickPosition.marker, 'setPosition');
    jest.spyOn(mapsPickPosition.map, 'panTo');
    jest.spyOn(mapsPickPosition.map, 'setZoom');

    mapsPickPosition.setPosition(DUMMY_POSITION);

    expect(mapsPickPosition.marker.setPosition).toBeCalledWith(DUMMY_POSITION);
    expect(mapsPickPosition.map.panTo).toBeCalledWith(DUMMY_POSITION);
    expect(mapsPickPosition.map.setZoom).toBeCalledWith(15);
  });
});
