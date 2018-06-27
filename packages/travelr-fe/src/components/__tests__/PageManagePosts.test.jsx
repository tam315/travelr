import { ListItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import { shallow } from 'enzyme';
import React from 'react';
import { PageManagePosts } from '../PageManagePosts';

describe('PageManagePosts component', () => {
  const DUMMY_USER = {
    userId: 'aaa',
    displayName: 'bbb',
    isAdmin: false,
    token: 'ccc',
  };

  const DUMMY_MY_POSTS = [
    {
      postId: 1,
      oldImageUrl: 'dummy_oldImageUrl',
      newImageUrl: 'dummy_newImageUrl',
      description: 'dummy_description',
      shootDate: '1999-09-09',
      lng: 'dummy_lng',
      lat: 'dummy_lat',
      viewCount: 100,
      displayName: 'dummy_displayName',
      likedCount: 101,
      commentsCount: 102,
      comments: [
        {
          commentId: 123,
          userId: 456,
          datetime: new Date('1985-03-31'),
          comment: 'dummy_comment',
        },
      ],
    },
    {
      postId: 2,
      oldImageUrl: 'dummy_oldImageUrl',
      newImageUrl: 'dummy_newImageUrl',
      description: 'dummy_description',
      shootDate: '1999-09-09',
      lng: 'dummy_lng',
      lat: 'dummy_lat',
      viewCount: 200,
      displayName: 'dummy_displayName',
      likedCount: 201,
      commentsCount: 202,
      comments: [
        {
          commentId: 123,
          userId: 456,
          datetime: new Date('1985-03-31'),
          comment: 'dummy_comment',
        },
      ],
    },
  ];

  let mock;
  let wrapper;

  beforeEach(() => {
    fetch.mockResponse();

    mock = {
      actions: {
        fetchMyPosts: jest.fn(),
        deleteMyPosts: jest.fn(),
        selectMyPosts: jest.fn(),
        selectMyPostsAll: jest.fn(),
        selectMyPostsReset: jest.fn(),
      },
      history: { push: jest.fn() },
    };

    wrapper = shallow(
      <PageManagePosts
        user={DUMMY_USER}
        posts={{ myPosts: DUMMY_MY_POSTS, myPostsSelected: [] }}
        classes={{}}
        fetchMyPosts={mock.actions.fetchMyPosts}
        deleteMyPosts={mock.actions.deleteMyPosts}
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

  test('deleteMyPosts() called when the menu item is clicked', () => {
    wrapper
      .find(MenuItem)
      .at(2)
      .simulate('click');
    expect(mock.actions.deleteMyPosts).toHaveBeenCalledTimes(1);
  });

  test('selectMyPosts() called when a checkbox is clicked', () => {
    wrapper
      .find(Checkbox)
      .at(0)
      .simulate('change');

    expect(mock.actions.selectMyPosts).toHaveBeenCalledTimes(1);
    expect(mock.actions.selectMyPosts).toHaveBeenCalledWith([
      DUMMY_MY_POSTS[0].postId,
    ]);
  });

  test('has links to the posts', () => {
    expect(
      wrapper
        .find(ListItem)
        .filterWhere(node => node.prop('to').includes('/post/')),
    ).toHaveLength(DUMMY_MY_POSTS.length);
  });
});
