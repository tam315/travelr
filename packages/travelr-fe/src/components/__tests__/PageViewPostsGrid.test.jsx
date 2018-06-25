import GridListTile from '@material-ui/core/GridListTile';
import { shallow } from 'enzyme';
import React from 'react';
import PageViewPostsGrid from '../PageViewPostsGrid';

jest.mock('react-router-dom');

const DUMMY_POSTS = [
  { postId: 1, likedCount: 888 },
  { postId: 2, likedCount: 999 },
];

describe('PageViewPostsGrid component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <PageViewPostsGrid posts={DUMMY_POSTS} classes={{}} />,
    ).dive();
  });

  test('shows tiles', () => {
    expect(wrapper.find(GridListTile)).toHaveLength(2);
  });

  test('shows StatusBadges', () => {
    expect(
      wrapper
        .find('StatusBadge')
        .at(0)
        .prop('count'),
    ).toBe(DUMMY_POSTS[0].likedCount);
    expect(
      wrapper
        .find('StatusBadge')
        .at(1)
        .prop('count'),
    ).toBe(DUMMY_POSTS[1].likedCount);
  });

  test('has link to the post page', () => {
    expect(wrapper.find({ to: `/post/${DUMMY_POSTS[0].postId}` })).toHaveLength(
      1,
    );
  });
});
