// @flow
import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import { PageCreatePost } from '../PageCreatePost';
import { DUMMY_USER_STORE } from '../../config/dummies';
import firebaseUtils from '../../utils/firebaseUtils';

jest.mock('../../utils/firebaseUtils');

const DUMMY_POST_ID_CREATED = 12345;

const DUMMY_STATE = {
  oldImageFilePath: 'dummy',
  newImageFilePath: 'dummy',
  description: 'dummy_description',
  shootDate: '1985-3-31',
  lng: 135.0,
  lat: 35.0,
};

describe('PageCreatePost component', () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    mock = {
      history: { push: jest.fn() },
      createPost: jest.fn((user, newPost, callback) => callback()),
    };

    wrapper = shallow(
      <PageCreatePost
        // $FlowIgnore
        history={mock.history}
        classes={{}}
        user={DUMMY_USER_STORE}
        createPost={mock.createPost}
      />,
    );
  });

  test('renders submit button', () => {
    expect(
      wrapper
        .find(Button)
        .last()
        .html(),
    ).toContain('投稿する');
  });

  test('prevent submit if the some content is missing', () => {
    wrapper
      .find(Button)
      .last()
      .simulate('click');
    expect(fetch).not.toBeCalled();
  });

  test('submit data if the content is OK', async done => {
    wrapper.setState(DUMMY_STATE);
    wrapper.instance().oldImage.current = {};
    wrapper.instance().oldImage.current.files = ['file1'];
    wrapper.instance().newImage.current = {};
    wrapper.instance().newImage.current.files = ['file2'];

    wrapper
      .find(Button)
      .last()
      .simulate('click');

    setImmediate(() => {
      expect(firebaseUtils.uploadImageFile).toBeCalledTimes(2);
      expect(mock.createPost).toBeCalled();
      expect(mock.history.push).toBeCalled();
      done();
    });
  });

  test('navigete to post page if success', async () => {
    fetch.mockResponse(JSON.stringify({ postId: DUMMY_POST_ID_CREATED }));
    wrapper.setState(DUMMY_STATE);
    wrapper
      .find(Button)
      .last()
      .simulate('click');

    setTimeout(
      () =>
        expect(mock.history.push).toBeCalledWith(
          `/post/${DUMMY_POST_ID_CREATED}`,
        ),
      1,
    );
  });
});
