import MapsHelper from '../MapsHelper';
import loadJS from '../loadJS';

jest.mock('../loadJS');

const DUMMY_POSTS = ['post1', 'post2', 'post3', 'post4', 'post5'];

const setGoogleMapsApiMock = () => {
  google = {
    maps: {
      LatLng: jest.fn(),
      Map: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
      })),
      Marker: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
        setMap: jest.fn(),
      })),
      InfoWindow: jest.fn(),
    },
  };
  MarkerClusterer = jest.fn().mockImplementation(() => ({
    clearMarkers: jest.fn(),
  }));
};

const deleteGoogleMapsApiMock = () => {
  google = undefined;
};

describe('MapsHelper', () => {
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
    const mapsHelper = new MapsHelper(mapRef); /* eslint-disable-line */

    expect(loadJS).toHaveBeenCalledTimes(1);
    expect(loadJS.mock.calls[0][0]).toContain('maps.googleapis.com/maps/api/');
  });

  test('initialize the maps if the API is already available', () => {
    setGoogleMapsApiMock();
    const mapsHelper = new MapsHelper(mapRef); /* eslint-disable-line */

    expect(google.maps.Map).toHaveBeenCalledTimes(1);
  });

  test('markers are created immediately if the API is already available', () => {
    setGoogleMapsApiMock();
    const mapsHelper = new MapsHelper(mapRef);

    mapsHelper.placePosts(DUMMY_POSTS);
    mapsHelper.placePosts(DUMMY_POSTS);
    mapsHelper.placePosts(DUMMY_POSTS);

    // posts shouldn't be queued
    expect(mapsHelper.queuedPosts).toHaveLength(0);

    // markers created immediately each time
    expect(google.maps.Marker).toHaveBeenCalledTimes(DUMMY_POSTS.length * 3);
    expect(mapsHelper.queuedPosts).toHaveLength(0);
  });

  test('marker creation is queued if the API is not ready', () => {
    const mapsHelper = new MapsHelper(mapRef);

    mapsHelper.placePosts(DUMMY_POSTS);
    mapsHelper.placePosts(DUMMY_POSTS);
    mapsHelper.placePosts(DUMMY_POSTS);
    expect(mapsHelper.queuedPosts).toHaveLength(3);
  });

  test('pended marker creation should be done after the API is loaded', () => {
    const mapsHelper = new MapsHelper(mapRef);

    // marker creation should be queued
    mapsHelper.placePosts(DUMMY_POSTS);
    mapsHelper.placePosts(DUMMY_POSTS);
    mapsHelper.placePosts(DUMMY_POSTS);
    expect(mapsHelper.queuedPosts).toHaveLength(3);

    // simulates the state where the API is ready
    setGoogleMapsApiMock();
    mapsHelper.mapInitializerGenerator(mapRef)();

    // create map
    expect(google.maps.Map).toHaveBeenCalledTimes(1);

    // create only the marker of the last queue
    expect(google.maps.Marker).toHaveBeenCalledTimes(DUMMY_POSTS.length * 1);

    // queue should be reset
    expect(mapsHelper.queuedPosts).toHaveLength(0);
  });
});
