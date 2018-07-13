import MapsShowAllPosition from '../MapsShowAllPosition';
import loadJS from '../loadJS';
import { DUMMY_POSTS } from '../../config/dummies';
import { deleteGoogleMapsApiMock, setGoogleMapsApiMock } from '../testHelper';

jest.mock('../loadJS');

const DUMMY_POSTS_ORIGINAL = DUMMY_POSTS.slice(0, -2);
const DUMMY_POSTS_UPDATED = DUMMY_POSTS.slice(-2, DUMMY_POSTS.length);

describe('MapsShowAllPosition', () => {
  let mapRef;
  let mockCallback;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCallback = jest.fn();

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
    //  eslint-disable-next-line
    const mapsShowAllPosition = new MapsShowAllPosition(mapRef); /**/

    expect(loadJS).toHaveBeenCalledTimes(1);
    expect(loadJS.mock.calls[0][0]).toContain('maps.googleapis.com/maps/api/');
  });

  test('initialize the maps if the API is already available', () => {
    setGoogleMapsApiMock();
    //  eslint-disable-next-line
    const mapsShowAllPosition = new MapsShowAllPosition(mapRef);

    expect(google.maps.Map).toHaveBeenCalledTimes(1);
  });

  test('markers are created immediately if the API is already available', () => {
    setGoogleMapsApiMock();
    const mapsShowAllPosition = new MapsShowAllPosition(mapRef);

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
    const mapsShowAllPosition = new MapsShowAllPosition(mapRef);

    // only last posts should be queued
    mapsShowAllPosition.placePosts(DUMMY_POSTS_ORIGINAL);
    mapsShowAllPosition.placePosts(DUMMY_POSTS_ORIGINAL);
    mapsShowAllPosition.placePosts(DUMMY_POSTS_UPDATED);
    expect(mapsShowAllPosition.queuedPosts).toEqual(DUMMY_POSTS_UPDATED);

    // simulates the state where the API is ready
    setGoogleMapsApiMock();
    mapsShowAllPosition.mapInitializerGenerator(mapRef)();

    // map should be created
    expect(google.maps.Map).toHaveBeenCalledTimes(1);

    // marker should be created for the lastly queued posts
    expect(google.maps.Marker).toHaveBeenCalledTimes(
      DUMMY_POSTS_UPDATED.length * 1,
    );

    // queue should be reset
    expect(mapsShowAllPosition.queuedPosts).toBe(null);
  });

  test('set callback as a global to call it from infowindow', () => {
    // eslint-disable-next-line
    const mapsShowAllPosition = new MapsShowAllPosition(mapRef, mockCallback);

    // queue should be reset
    expect(window.mapsShowAllPositionOnPostClick).toBe(mockCallback);
  });
});
