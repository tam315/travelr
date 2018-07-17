import { Button, MenuItem } from '@material-ui/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DUMMY_USER_STORE, DUMMY_POSTS } from '../../config/dummies';
import { PageViewPostComments } from '../PageViewPostComments';

declare const fetch: any;

jest.mock('../StatusBadge');

const DUMMY_POST = DUMMY_POSTS[0];

describe('PageViewPostComments component', () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    fetch.resetMocks();
    mock = {
      actions: {
        createComment: jest.fn(),
        deleteComment: jest.fn(),
      },
    };

    wrapper = shallow(
      <PageViewPostComments
        user={DUMMY_USER_STORE}
        post={DUMMY_POST}
        createComment={mock.actions.createComment}
        deleteComment={mock.actions.deleteComment}
      />,
    );
  });

  test('render comments and comment posting form', () => {
    // comment writing form
    expect(wrapper.find({ placeholder: 'コメントを書く' })).toHaveLength(1);
    // comments
    expect(wrapper.find({ className: 'comment' })).toHaveLength(
      DUMMY_POST.comments.length,
    );
  });

  test('shows comment posting button when user writes the comment', () => {
    // button is hidden
    expect(wrapper.find(Button)).toHaveLength(0);

    // if user write a comment
    wrapper
      .find({ placeholder: 'コメントを書く' })
      .simulate('change', { target: { value: 'cat' } });

    // button is now visible
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  test('createComment() is called when click a button', () => {
    // user write a comment
    wrapper
      .find({ placeholder: 'コメントを書く' })
      .simulate('change', { target: { value: 'cat' } });

    // user pressed send button
    wrapper.find(Button).simulate('click');

    expect(mock.actions.createComment.mock.calls[0][0]).toBe(DUMMY_USER_STORE);
    expect(mock.actions.createComment.mock.calls[0][1]).toBe(DUMMY_POST.postId);
    expect(mock.actions.createComment.mock.calls[0][2]).toBe('cat');
  });

  test('clear comment input if comment creation succeed', () => {
    // user enter a comment
    wrapper
      .find({ placeholder: 'コメントを書く' })
      .simulate('change', { target: { value: 'dummy_comment1' } });

    expect(wrapper.state('comment')).toBe('dummy_comment1');

    // user pressed send button
    wrapper.find(Button).simulate('click');

    wrapper.setProps({ post: DUMMY_POST });
    wrapper.instance().componentDidUpdate();

    // assume that comment creation is succeed
    // if the new props has the same string as the comment input
    expect(wrapper.state('comment')).toBe('');
  });

  test('deleteComment() is called when click a menu item', () => {
    wrapper
      .find(MenuItem)
      .at(0)
      .simulate('click');
    expect(mock.actions.deleteComment).toBeCalled();
    expect(mock.actions.deleteComment.mock.calls[0][0]).toBe(DUMMY_USER_STORE);
    expect(mock.actions.deleteComment.mock.calls[0][1]).toBe(
      DUMMY_POST.comments[0],
    );
  });
});
