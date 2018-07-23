import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DUMMY_POSTS, DUMMY_APP_STORE } from '../../config/dummies';
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
    };
    // manual implementation is required for the ES6 classes that uses arrow function.
    // https://facebook.github.io/jest/docs/en/es6-class-mocks.html
    MapsShowAllPosition.prototype.placePosts = mock.placePosts;

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
    wrapper.instance().mapRef = { current: {} };
    wrapper.instance().componentDidMount();
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
    wrapper.instance().mapRef = { current: {} };
    wrapper.instance().componentDidMount();

    expect(mock.placePosts).toHaveBeenCalledTimes(1);
  });

  test('re-render posts when posts are updated', () => {
    wrapper.instance().mapRef = { current: {} };
    wrapper.instance().componentDidMount();

    expect(mock.placePosts).toHaveBeenCalledTimes(1);
    wrapper.setProps({ posts: DUMMY_POSTS_UPDATED });
    expect(mock.placePosts).toHaveBeenCalledTimes(2);
  });
});
