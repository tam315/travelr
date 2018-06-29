// @flow
import { ListItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import { shallow } from 'enzyme';
import React from 'react';
import {
  DUMMY_POSTS,
  DUMMY_USER_STORE,
  DUMMY_POSTS_STORE,
} from '../../config/dummies';
import { PageManagePosts } from '../PageManagePosts';

describe('PageManagePosts component', () => {
  let mock;
  let wrapper;

  beforeEach(() => {
    fetch.mockResponse();

    mock = {
      actions: {
        fetchMyPosts: jest.fn(),
        deletePosts: jest.fn(),
        selectMyPosts: jest.fn(),
        selectMyPostsAll: jest.fn(),
        selectMyPostsReset: jest.fn(),
      },
      history: { push: jest.fn() },
    };

    wrapper = shallow(
      <PageManagePosts
        user={DUMMY_USER_STORE}
        posts={DUMMY_POSTS_STORE}
        classes={{}}
        fetchMyPosts={mock.actions.fetchMyPosts}
        deletePosts={mock.actions.deletePosts}
        selectMyPosts={mock.actions.selectMyPosts}
        selectMyPostsAll={mock.actions.selectMyPostsAll}
        selectMyPostsReset={mock.actions.selectMyPostsReset}
      />,
    );
  });

  test('shows menu', () => {
    expect(
      wrapper
        .find(Button)
        .children()
        .text(),
    ).toBe('一括');
    expect(
      wrapper
        .find(MenuItem)
        .at(0)
        .html(),
    ).toContain('すべて選択');
    expect(
      wrapper
        .find(MenuItem)
        .at(1)
        .html(),
    ).toContain('選択を解除');
    expect(
      wrapper
        .find(MenuItem)
        .at(2)
        .html(),
    ).toContain('選択した投稿を削除');
  });

  test('fetchMyPosts() called on componentDidMount', () => {
    expect(mock.actions.fetchMyPosts).toHaveBeenCalledTimes(1);
  });

  test('fetchMyPosts() called if user is changed', () => {
    wrapper.setProps({ user: { userId: 'someNewId' } });
    expect(mock.actions.fetchMyPosts).toHaveBeenCalledTimes(2);
  });

  test('selectMyPostsAll() called when the menu item is clicked', () => {
    wrapper
      .find(MenuItem)
      .at(0)
      .simulate('click');
    expect(mock.actions.selectMyPostsAll).toHaveBeenCalledTimes(1);
  });

  test('selectMyPostsReset() called when the menu item is clicked', () => {
    wrapper
      .find(MenuItem)
      .at(1)
      .simulate('click');
    expect(mock.actions.selectMyPostsReset).toHaveBeenCalledTimes(1);
  });

  test('deletePosts() called when the menu item is clicked', () => {
    wrapper
      .find(MenuItem)
      .at(2)
      .simulate('click');
    expect(mock.actions.deletePosts).toHaveBeenCalledTimes(1);
  });

  test('selectMyPosts() called when a checkbox is clicked', () => {
    wrapper
      .find(Checkbox)
      .at(2)
      .simulate('change');

    expect(mock.actions.selectMyPosts).toHaveBeenCalledTimes(1);
    expect(mock.actions.selectMyPosts).toHaveBeenCalledWith([
      DUMMY_POSTS[2].postId,
    ]);
  });

  test('has links to the posts', () => {
    expect(
      wrapper
        .find(ListItem)
        .filterWhere(node => node.prop('to').includes('/post/')),
    ).toHaveLength(DUMMY_POSTS.length);
  });
});
