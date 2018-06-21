import GridListTile from '@material-ui/core/GridListTile';
import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PageViewPostsGrid from '../PageViewPostsGrid';

const DUMMY_POSTS = [
  { postId: 1, likedCount: 888 },
  { postId: 2, likedCount: 999 },
];

describe('PageViewPostsGrid component', () => {
  test('shows tiles and StatusBadges', () => {
    const wrapper = mount(
      <BrowserRouter>
        <PageViewPostsGrid posts={DUMMY_POSTS} classes={{}} />
      </BrowserRouter>,
    );
    expect(wrapper.text()).toContain(888);
    expect(wrapper.text()).toContain(999);
    expect(wrapper.find(GridListTile)).toHaveLength(2);
  });
});
