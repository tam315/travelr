import { shallow } from 'enzyme';
import * as React from 'react';
import { DUMMY_APP_STORE, DUMMY_POSTS } from '../../config/dummies';
import MapsShowAllPosition from '../../utils/MapsShowAllPosition';
import { PageViewPostsMap } from '../PageViewPostsMap';

jest.mock('../../utils/MapsShowAllPosition');

const DUMMY_POSTS_ORIGINAL = DUMMY_POSTS.slice(0, -2);
const DUMMY_POSTS_UPDATED = DUMMY_POSTS.slice(-2, DUMMY_POSTS.length);

describe('PageViewPostsMap component', () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    mock = {
      actions: {
        saveMapZoomAndCenter: jest.fn(),
      },
      placePosts: jest.fn(),
      updateZoomAndCenter: jest.fn(),
    };
    // manual implementation is required for the ES6 classes that uses arrow function.
    // https://facebook.github.io/jest/docs/en/es6-class-mocks.html
    MapsShowAllPosition.prototype.placePosts = mock.placePosts;
    MapsShowAllPosition.prototype.updateZoomAndCenter =
      mock.updateZoomAndCenter;

    wrapper = shallow(
      <PageViewPostsMap
        app={DUMMY_APP_STORE}
        posts={DUMMY_POSTS_ORIGINAL}
        classes={{}}
        saveMapZoomAndCenter={mock.actions.saveMapZoomAndCenter}
      />,
    );
  });

  test('instantiate google maps', () => {
    // @ts-ignore
    const options = MapsShowAllPosition.mock.calls[0][1];

    expect(MapsShowAllPosition).toHaveBeenCalledTimes(1);
    expect(options.zoomAndCenter).toEqual({
      zoom: DUMMY_APP_STORE.mapZoomLevel,
      center: {
        lng: DUMMY_APP_STORE.mapLng,
        lat: DUMMY_APP_STORE.mapLat,
      },
    });
  });

  test('render posts when the component mounted', () => {
    expect(mock.placePosts).toHaveBeenCalledTimes(1);
  });

  test('update posts if store is updated', () => {
    expect(mock.placePosts).toHaveBeenCalledTimes(1);
    wrapper.setProps({ posts: DUMMY_POSTS_UPDATED });
    expect(mock.placePosts).toHaveBeenCalledTimes(2);
  });

  test('update zoom and center if store is updated', () => {
    const updated = {
      mapLatUpdated: 1,
      mapLngUpdated: 2,
      mapZoomLevel: 3,
    };

    expect(mock.updateZoomAndCenter).toHaveBeenCalledTimes(0);
    wrapper.setProps({ app: { ...DUMMY_APP_STORE, ...updated } });
    expect(mock.updateZoomAndCenter).toHaveBeenCalledTimes(1);
  });

  test('handle detailed posts correctly', () => {
    // initial
    expect(wrapper.state('detailedPosts')).toEqual([]);

    // click pin
    wrapper.instance().handlePinClick(DUMMY_POSTS[0]);
    expect(wrapper.state('detailedPosts')).toEqual([DUMMY_POSTS[0]]);

    // reset
    wrapper.instance().handleDetailClose();
    expect(wrapper.state('detailedPosts')).toEqual([]);

    // click cluster
    wrapper.instance().handleClusterClick(DUMMY_POSTS);
    expect(wrapper.state('detailedPosts')).toEqual(DUMMY_POSTS);

    // reset
    wrapper.instance().handleDetailClose();
    expect(wrapper.state('detailedPosts')).toEqual([]);
  });
});
