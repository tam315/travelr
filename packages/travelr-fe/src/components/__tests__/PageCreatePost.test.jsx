// @flow
import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import { PageCreatePost } from '../PageCreatePost';
import { DUMMY_USER_STORE } from '../../config/dummies';

const DUMMY_POST_ID_CREATED = 12345;

const DUMMY_POST_DATA_TO_CREATE = {
  oldImageFilePath: 'dummy',
  newImageFilePath: 'dummy',
  description: 'dummy_description',
  shootDate: '1985-3-31',
  lng: 135.0,
  lat: 35.0,
};

describe('PageCreatePost component', () => {
  let wrapper;
  let mockHistory;

  beforeEach(() => {
    mockHistory = {
      push: jest.fn(),
    };

    wrapper = shallow(
      <PageCreatePost
        // $FlowIgnore
        history={mockHistory}
        classes={{}}
        user={DUMMY_USER_STORE}
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

  test('submit data if the content is OK', async () => {
    fetch.mockResponse(JSON.stringify({ postId: DUMMY_POST_ID_CREATED }));
    wrapper.setState(DUMMY_POST_DATA_TO_CREATE);
    wrapper
      .find(Button)
      .last()
      .simulate('click');

    // createPost() should be called with valid args
    const fetchUrl = fetch.mock.calls[0][0];
    const fetchOptions = fetch.mock.calls[0][1];
    const body = JSON.parse(fetchOptions.body);
    expect(fetch).toBeCalled();
    expect(fetchUrl).toContain('/posts');
    expect(fetchOptions.method).toBe('POST');
    expect(body.description).toEqual(DUMMY_POST_DATA_TO_CREATE.description);
    expect(body.shootDate).toEqual(DUMMY_POST_DATA_TO_CREATE.shootDate);
    expect(body.lng).toEqual(DUMMY_POST_DATA_TO_CREATE.lng);
    expect(body.lat).toEqual(DUMMY_POST_DATA_TO_CREATE.lat);
    setTimeout(
      () =>
        expect(mockHistory.push).toBeCalledWith(
          `/post/${DUMMY_POST_ID_CREATED}`,
        ),
      1,
    );
  });

  test('navigete to post page if success', async () => {
    fetch.mockResponse(JSON.stringify({ postId: DUMMY_POST_ID_CREATED }));
    wrapper.setState(DUMMY_POST_DATA_TO_CREATE);
    wrapper
      .find(Button)
      .last()
      .simulate('click');

    setTimeout(
      () =>
        expect(mockHistory.push).toBeCalledWith(
          `/post/${DUMMY_POST_ID_CREATED}`,
        ),
      1,
    );
  });
});
