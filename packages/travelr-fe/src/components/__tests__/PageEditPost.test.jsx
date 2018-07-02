// @flow
import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import { PageEditPost } from '../PageEditPost';
import {
  DUMMY_USER_STORE,
  DUMMY_POST_TO_EDIT,
  DUMMY_POSTS_STORE,
} from '../../config/dummies';

describe('PageEditPost component', () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    mock = {
      history: { push: jest.fn() },
      actions: {
        editPost: jest.fn((user, postToEdit, callback) =>
          callback(postToEdit.postId),
        ),
        fetchPost: jest.fn(),
      },
    };
    const match = { params: { postId: DUMMY_POST_TO_EDIT.postId } };

    wrapper = shallow(
      <PageEditPost
        classes={{}}
        // $FlowIgnore
        match={match}
        // $FlowIgnore
        history={mock.history}
        user={DUMMY_USER_STORE}
        posts={DUMMY_POSTS_STORE}
        editPost={mock.actions.editPost}
        fetchPost={mock.actions.fetchPost}
      />,
    );
  });

  test('render nothing if the post is not fetched yet', () => {
    expect(wrapper.children()).toHaveLength(0);
    wrapper.setState(DUMMY_POST_TO_EDIT);
    expect(wrapper.children()).toHaveLength(1);
  });

  test('editPost() is called when a submit button is clicked', async () => {
    wrapper.setState(DUMMY_POST_TO_EDIT);
    wrapper.find(Button).simulate('click');

    expect(mock.actions.editPost).toBeCalled();
    expect(mock.actions.editPost.mock.calls[0][0]).toEqual(DUMMY_USER_STORE);
    expect(mock.actions.editPost.mock.calls[0][1]).toEqual(DUMMY_POST_TO_EDIT);
  });

  test('navigete to post page if edit succeed', async () => {
    fetch.mockResponse(JSON.stringify({ postId: DUMMY_POST_TO_EDIT.postId }));
    wrapper.setState(DUMMY_POST_TO_EDIT);
    wrapper.find(Button).simulate('click');

    expect(mock.history.push).toBeCalledWith(
      `/post/${DUMMY_POST_TO_EDIT.postId}`,
    );
  });
});
