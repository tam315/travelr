// @flow
import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import {
  DUMMY_POSTS,
  DUMMY_USER_STORE,
  DUMMY_POSTS_STORE,
} from '../../config/dummies';
import { PageViewPostComments } from '../PageViewPostComments';

jest.mock('../StatusBadge');

// dummy data from the API
const DUMMY_POST = DUMMY_POSTS[0];

describe('PageViewPostComments component', () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    fetch.resetMocks();
    mock = {
      actions: {
        createComment: jest.fn((user, postId, comment, successCallback) =>
          successCallback(),
        ),
      },
    };

    wrapper = shallow(
      <PageViewPostComments
        user={DUMMY_USER_STORE}
        posts={DUMMY_POSTS_STORE}
        createComment={mock.actions.createComment}
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
    fetch.mockResponse();

    // user write a comment
    wrapper
      .find({ placeholder: 'コメントを書く' })
      .simulate('change', { target: { value: 'cat' } });

    // user pressed send button
    wrapper.find(Button).simulate('click');

    expect(mock.actions.createComment.mock.calls[0][0]).toBe(DUMMY_USER_STORE);
    expect(mock.actions.createComment.mock.calls[0][1]).toBe(DUMMY_POST.postId);
    expect(mock.actions.createComment.mock.calls[0][2]).toBe('cat');

    // reset comment input
    expect(wrapper.state('comment')).toBe('');
  });
});
