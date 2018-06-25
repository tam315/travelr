import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import { PageCreatePost } from '../PageCreatePost';

const DUMMY_POST_ID = 12345;

const DUMMY_POST_DATA = {
  oldImageFilePath: 'dummy',
  newImageFilePath: 'dummy',
  description: 'dummy_description',
  shootDate: '1985-3-31',
  lng: 135.0,
  lat: 35.0,
};

describe('PageViewPost component', () => {
  let wrapper;
  let mockCreatePost;
  let mockHistory;

  beforeEach(() => {
    mockCreatePost = jest.fn((post, successCallback) =>
      successCallback(DUMMY_POST_ID),
    );
    mockHistory = {
      push: jest.fn(),
    };

    wrapper = shallow(
      <PageCreatePost
        createPost={mockCreatePost}
        history={mockHistory}
        classes={{}}
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
    expect(mockCreatePost).not.toBeCalled();
  });

  test('submit data if the content is OK', () => {
    wrapper.setState(DUMMY_POST_DATA);
    wrapper
      .find(Button)
      .last()
      .simulate('click');

    // createPost() should be called
    expect(mockCreatePost).toBeCalled();

    // createPost() should be called with valid args
    const arg = mockCreatePost.mock.calls[0][0];
    expect(arg.description).toEqual(DUMMY_POST_DATA.description);
    expect(arg.shootDate).toEqual(DUMMY_POST_DATA.shootDate);
    expect(arg.lng).toEqual(DUMMY_POST_DATA.lng);
    expect(arg.lat).toEqual(DUMMY_POST_DATA.lat);

    // navigate to created post's page
    expect(mockHistory.push).toBeCalledWith(`/post/${DUMMY_POST_ID}`);
  });
});
