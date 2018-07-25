import { Button, Modal } from '@material-ui/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DUMMY_POSTS } from '../../config/dummies';
import history from '../../utils/history';
import { PageViewPostsMapDetail } from '../PageViewPostsMapDetail';

jest.mock('../../utils/history');

describe('PageViewPostsMapDetail component', () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    mock = {
      onClose: jest.fn(),
    };

    wrapper = shallow(
      <PageViewPostsMapDetail posts={[]} classes={{}} onClose={mock.onClose} />,
    );
  });

  test('show modal if `posts` array has length', () => {
    expect(wrapper.find(Modal)).toHaveLength(0);
    wrapper.setProps({ posts: DUMMY_POSTS });
    expect(wrapper.find(Modal)).toHaveLength(1);
  });

  test('pager is shown when posts have multiple items', () => {
    expect(wrapper.find({ dataenzyme: 'pager-container' })).toHaveLength(0);
    wrapper.setProps({ posts: DUMMY_POSTS });
    expect(wrapper.find({ dataenzyme: 'pager-container' })).toHaveLength(1);
  });

  test('arrow button increase & decrease currentIndex', () => {
    wrapper.setProps({ posts: DUMMY_POSTS });
    expect(wrapper.state('currentIndex')).toBe(0);

    wrapper.find({ dataenzyme: 'button-next' }).simulate('click');
    expect(wrapper.state('currentIndex')).toBe(1);

    wrapper.find({ dataenzyme: 'button-previous' }).simulate('click');
    expect(wrapper.state('currentIndex')).toBe(0);
  });

  test('pressing arrow key increase & decrease currentIndex', () => {
    wrapper.setProps({ posts: DUMMY_POSTS });
    expect(wrapper.state('currentIndex')).toBe(0);

    // right arrow
    wrapper.simulate('keydown', { keyCode: 39 });
    expect(wrapper.state('currentIndex')).toBe(1);

    // left arrow
    wrapper.simulate('keydown', { keyCode: 37 });
    expect(wrapper.state('currentIndex')).toBe(0);
  });

  test('navigate user to the post page', () => {
    wrapper.setProps({ posts: DUMMY_POSTS });
    wrapper
      .find(Button)
      .at(2)
      .simulate('click');
    expect(history.push).toBeCalledWith(`/post/${DUMMY_POSTS[0].postId}`);
  });

  test('onClose() is called when close button clicked', () => {
    wrapper.setProps({ posts: DUMMY_POSTS });
    wrapper
      .find(Button)
      .at(3)
      .simulate('click');
    expect(mock.onClose).toHaveBeenCalledTimes(1);
  });
});
