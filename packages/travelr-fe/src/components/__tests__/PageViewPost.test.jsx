// @flow
import Typography from '@material-ui/core/Typography';
import { shallow } from 'enzyme';
import React from 'react';
import ReactCompareImage from 'react-compare-image';
import {
  DUMMY_POSTS,
  DUMMY_USER_STORE,
  DUMMY_USER_STORE_UNAUTHORIZED,
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
      deleteComment: jest.fn(),
      fetchPost: jest.fn(),
      toggleLike: jest.fn(),
    };

    wrapper = shallow(
      <PageViewPost
        classes={{}}
        // $FlowIgnore
        match={match}
        user={DUMMY_USER_STORE}
        posts={DUMMY_POSTS_STORE}
        createComment={mock.createComment}
        deleteComment={mock.deleteComment}
        fetchPost={mock.fetchPost}
        toggleLike={mock.toggleLike}
      />,
    );
  });

  test('fetchPost() is called when componentDidMount', () => {
    expect(mock.fetchPost).toHaveBeenCalledTimes(1);
    expect(mock.fetchPost.mock.calls[0][0]).toBe(match.params.postId);
    expect(mock.fetchPost.mock.calls[0][1]).toBe(DUMMY_USER_STORE);
  });

  test('fetchPost() is called when user store is changed', () => {
    wrapper.setProps({ user: DUMMY_USER_STORE_UNAUTHORIZED });
    expect(mock.fetchPost).toHaveBeenCalledTimes(2);
    expect(mock.fetchPost.mock.calls[1][0]).toBe(match.params.postId);
    expect(mock.fetchPost.mock.calls[1][1]).toBe(DUMMY_USER_STORE_UNAUTHORIZED);
  });

  test('toggleLike() is called when StatusBadge is clicked', () => {
    wrapper
      .find(StatusBadge)
      .at(0)
      .simulate('click');
    expect(mock.toggleLike).toBeCalled();
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
});
