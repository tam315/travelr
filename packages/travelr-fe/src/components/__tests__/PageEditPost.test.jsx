// @flow
import { Button, Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import { PageEditPost } from '../PageEditPost';
import {
  DUMMY_USER_STORE,
  DUMMY_POST_TO_EDIT,
  DUMMY_POSTS_STORE,
} from '../../config/dummies';
import MapsPickPosition from '../../utils/MapsPickPosition';

jest.mock('../../utils/MapsPickPosition');

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
        deletePost: jest.fn((user, postId, callback) => callback()),
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
        deletePost={mock.actions.deletePost}
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

  test('deletePost() is called when a delete button is clicked', async () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    wrapper.setState(DUMMY_POST_TO_EDIT);
    wrapper
      .find(Typography)
      .last()
      .simulate('click');

    expect(mock.actions.deletePost).toBeCalled();
    expect(mock.actions.deletePost.mock.calls[0][0]).toEqual(DUMMY_USER_STORE);
    expect(mock.actions.deletePost.mock.calls[0][1]).toEqual(
      DUMMY_POST_TO_EDIT.postId,
    );
  });

  test('navigete to all-grid page if deletion succeed', async () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    fetch.mockResponse();
    wrapper.setState(DUMMY_POST_TO_EDIT);
    wrapper
      .find(Typography)
      .last()
      .simulate('click');

    expect(mock.history.push).toBeCalledWith('/all-grid');
  });

  test('instantiate map', async () => {
    wrapper.setState(DUMMY_POST_TO_EDIT);
    wrapper.instance().mapRef = { current: {} };
    wrapper.instance().refreshMap();

    expect(MapsPickPosition).toBeCalled();
  });

  test('handle pin position change correctly', async () => {
    wrapper.setState(DUMMY_POST_TO_EDIT);
    wrapper.instance().handlePinPositionChange({ lat: 35, lng: 135 });

    expect(wrapper.state('lat')).toBe(35);
    expect(wrapper.state('lng')).toBe(135);
  });
});
