import { DUMMY_POSTS, DUMMY_ZOOM_AND_CENTER } from '../../config/dummies';
import MapsShowAllPosition from '../MapsShowAllPosition';
import { deleteGoogleMapsApiMock, setGoogleMapsApiMock } from '../testHelper';
import MarkerClusterer from '@google/markerclustererplus';

jest.mock('@google/markerclustererplus');

const DUMMY_POSTS_ORIGINAL = DUMMY_POSTS.slice(0, -2);
const DUMMY_POSTS_UPDATED = DUMMY_POSTS.slice(-2, DUMMY_POSTS.length);

describe('MapsShowAllPosition', () => {
  let mapRef;
  let mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mock = {
      onPinClick: jest.fn(),
      onClusterClick: jest.fn(),
      onZoomOrCenterChange: jest.fn(),
    };

    document.body.innerHTML =
      '<div>' +
      '  <script />' +
      '  <span id="username" />' +
      '  <button id="button" />' +
      '  <div id="maps" />' +
      '</div>';

    mapRef = document.getElementById('maps');

    MarkerClusterer.mockImplementation(() => ({
      addListener: jest.fn(),
      clearMarkers: jest.fn(),
    }));
  });

  afterEach(() => {
    deleteGoogleMapsApiMock();
  });

  const createMapInstance = () =>
    new MapsShowAllPosition(mapRef, {
      onPinClick: mock.onPinClick,
      onClusterClick: mock.onClusterClick,
      onZoomOrCenterChange: mock.onZoomOrCenterChange,
      zoomAndCenter: DUMMY_ZOOM_AND_CENTER,
    });

  test('initialize the maps if the API is already available', () => {
    setGoogleMapsApiMock();
    createMapInstance();

    expect(google.maps.Map).toHaveBeenCalledTimes(1);
  });

  test('markers are created immediately if the API is already available', () => {
    setGoogleMapsApiMock();
    const mapsShowAllPosition = createMapInstance();

    mapsShowAllPosition.placePosts(DUMMY_POSTS_ORIGINAL);
    mapsShowAllPosition.placePosts(DUMMY_POSTS_ORIGINAL);
    mapsShowAllPosition.placePosts(DUMMY_POSTS_UPDATED);

    // markers created immediately each time
    expect(google.maps.Marker).toHaveBeenCalledTimes(
      DUMMY_POSTS_ORIGINAL.length * 2 /* eslint-disable-line */ +
        DUMMY_POSTS_UPDATED.length * 1 /* eslint-disable-line */,
    );
    expect(mapsShowAllPosition.queuedPosts).toBe(null);
  });

  test('marker creation is queued until the API is ready', () => {
    const mapsShowAllPosition = createMapInstance();

    // only last posts should be queued
    mapsShowAllPosition.placePosts(DUMMY_POSTS_ORIGINAL);
    mapsShowAllPosition.placePosts(DUMMY_POSTS_ORIGINAL);
    mapsShowAllPosition.placePosts(DUMMY_POSTS_UPDATED);
    expect(mapsShowAllPosition.queuedPosts).toEqual(DUMMY_POSTS_UPDATED);

    // simulates the state where the API is ready
    setGoogleMapsApiMock();
    mapsShowAllPosition.mapInitializerGenerator(
      mapRef,
      DUMMY_ZOOM_AND_CENTER,
    )();

    // map should be created
    expect(google.maps.Map).toHaveBeenCalledTimes(1);

    // marker should be created for the lastly queued posts
    expect(google.maps.Marker).toHaveBeenCalledTimes(
      DUMMY_POSTS_UPDATED.length * 1,
    );

    // queue should be reset
    expect(mapsShowAllPosition.queuedPosts).toBe(null);
  });

  test('update zoom and center', () => {
    setGoogleMapsApiMock();
    const mapsShowAllPosition = createMapInstance();
    mapsShowAllPosition.updateZoomAndCenter({ lat: 1, lng: 2, zoomLevel: 3 });

    // queue should be reset
    // @ts-ignore
    expect(mapsShowAllPosition.map.setCenter).toBeCalled();
    expect(mapsShowAllPosition.map.setZoom).toBeCalled();
  });
});
