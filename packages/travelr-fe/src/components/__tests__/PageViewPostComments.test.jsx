// @flow
import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import { DUMMY_POSTS } from '../../config/dummies';
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
      onCreateComment: jest.fn(),
    };

    wrapper = shallow(
      <PageViewPostComments
        comments={DUMMY_POST.comments}
        onCreateComment={mock.onCreateComment}
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

  test('sends a comment and fetches post if success', () => {
    fetch.mockResponse();

    // user write a comment
    wrapper
      .find({ placeholder: 'コメントを書く' })
      .simulate('change', { target: { value: 'cat' } });

    // user pressed send button
    wrapper.find(Button).simulate('click');

    expect(mock.onCreateComment).toBeCalledWith('cat');
  });
});
