// @flow
import Typography from '@material-ui/core/Typography';
import { shallow } from 'enzyme';
import React from 'react';
import ReactCompareImage from 'react-compare-image';
import {
  DUMMY_POSTS,
  DUMMY_USER_STORE,
  DUMMY_POSTS_STORE,
} from '../../config/dummies';
import { PageViewPost } from '../PageViewPost';
import PageViewPostComments from '../PageViewPostComments';
import StatusBadge from '../StatusBadge';

jest.mock('../StatusBadge');

// dummy data from the API
const DUMMY_POST = DUMMY_POSTS[0];

// url params
const match = { params: { postId: DUMMY_POST.postId } };

describe('PageViewPost component', () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    fetch.resetMocks();
    mock = {
      createComment: jest.fn(),
      fetchPost: jest.fn(),
    };

    wrapper = shallow(
      <PageViewPost
        classes={{}}
        // $FlowIgnore
        match={match}
        user={DUMMY_USER_STORE}
        posts={DUMMY_POSTS_STORE}
        createComment={mock.createComment}
        fetchPost={mock.fetchPost}
      />,
    );
  });

  test('fetchPost() is called when componentDidMount', () => {
    expect(mock.fetchPost).toBeCalled();
    expect(mock.fetchPost).toBeCalledWith(match.params.postId);
  });

  test('render necessary parts', () => {
    // images
    expect(wrapper.find(ReactCompareImage)).toHaveLength(1);
    // badges
    expect(wrapper.find(StatusBadge)).toHaveLength(3);
    // displayName
    expect(
      wrapper
        .find(Typography)
        .at(0)
        .html(),
    ).toContain(DUMMY_POST.displayName);
    // description
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .html(),
    ).toContain(DUMMY_POST.description);
    // shootDate
    expect(
      wrapper
        .find(Typography)
        .at(2)
        .html(),
    ).toContain(DUMMY_POST.shootDate);
    // comments
    expect(wrapper.find(PageViewPostComments)).toHaveLength(1);
  });

  test('createPost() is called by PageViewPostComments', () => {
    wrapper
      .find(PageViewPostComments)
      .dive()
      .simulate('createComment', 'dummy_comment');
    expect(mock.createComment.mock.calls[0][0]).toBe(DUMMY_USER_STORE);
    expect(mock.createComment.mock.calls[0][1]).toBe(DUMMY_POST.postId);
    expect(mock.createComment.mock.calls[0][2]).toBe('dummy_comment');
  });
});
