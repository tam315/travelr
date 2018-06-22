import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PageViewPostsMap from '../PageViewPostsMap';
import MapsHelper from '../../utils/MapsHelper';

jest.mock('../../utils/MapsHelper');

const DUMMY_POSTS = [
  { postId: 1, likedCount: 888 },
  { postId: 2, likedCount: 999 },
];

const DUMMY_POSTS_UPDATED = [
  { postId: 3, likedCount: 888 },
  { postId: 4, likedCount: 999 },
];

let wrapper;
let mockPlacePostsFunc;

describe('PageViewPostsMap component', () => {
  beforeAll(() => {
    // manual implementation is required for the ES6 classes that uses arrow function.
    // https://facebook.github.io/jest/docs/en/es6-class-mocks.html
    mockPlacePostsFunc = jest.fn();
    MapsHelper.prototype.placePosts = mockPlacePostsFunc;

    wrapper = mount(
      <BrowserRouter>
        <PageViewPostsMap posts={DUMMY_POSTS} classes={{}} />
      </BrowserRouter>,
    );
  });

  test('instantiate google maps', () => {
    expect(MapsHelper).toHaveBeenCalledTimes(1);
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
