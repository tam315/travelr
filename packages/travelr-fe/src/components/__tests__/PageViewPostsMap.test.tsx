import { mount } from 'enzyme';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DUMMY_POSTS } from '../../config/dummies';

import MapsShowAllPosition from '../../utils/MapsShowAllPosition';
import PageViewPostsMap from '../PageViewPostsMap';

jest.mock('../../utils/MapsShowAllPosition');

const DUMMY_POSTS_ORIGINAL = DUMMY_POSTS.slice(0, -2);
const DUMMY_POSTS_UPDATED = DUMMY_POSTS.slice(-2, DUMMY_POSTS.length);

let wrapper;
let mockPlacePostsFunc;

describe('PageViewPostsMap component', () => {
  beforeAll(() => {
    // manual implementation is required for the ES6 classes that uses arrow function.
    // https://facebook.github.io/jest/docs/en/es6-class-mocks.html
    mockPlacePostsFunc = jest.fn();
    MapsShowAllPosition.prototype.placePosts = mockPlacePostsFunc;

    wrapper = mount(
      <BrowserRouter>
        <PageViewPostsMap posts={DUMMY_POSTS_ORIGINAL} classes={{}} />
      </BrowserRouter>,
    );
  });

  test('instantiate google maps', () => {
    expect(MapsShowAllPosition).toHaveBeenCalledTimes(1);
  });

  test('render posts when the component mounted', () => {
    expect(mockPlacePostsFunc).toHaveBeenCalledTimes(1);
  });

  test('re-render posts when posts are updated', () => {
    expect(mockPlacePostsFunc).toHaveBeenCalledTimes(1);
    wrapper.setProps({ posts: DUMMY_POSTS_UPDATED, classes: {} });
    expect(mockPlacePostsFunc).toHaveBeenCalledTimes(2);
  });
});
