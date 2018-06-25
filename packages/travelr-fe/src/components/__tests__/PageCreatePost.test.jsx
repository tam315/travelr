import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import { PageCreatePost } from '../PageCreatePost';

describe('PageViewPost component', () => {
  let wrapper;
  let mockCallback;

  beforeEach(() => {
    mockCallback = jest.fn();
    wrapper = shallow(
      <PageCreatePost createPost={mockCallback} classes={{}} />,
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
    expect(mockCallback).not.toBeCalled();
  });

  test('submit data if the content is OK', () => {
    const DUMMY_DATA = {
      oldImageFilePath: 'dummy',
      newImageFilePath: 'dummy',
      description: 'dummy_description',
      shootDate: '1985-3-31',
      lng: 135.0,
      lat: 35.0,
    };

    wrapper.setState(DUMMY_DATA);
    wrapper
      .find(Button)
      .last()
      .simulate('click');
    expect(mockCallback).toBeCalled();

    const arg = mockCallback.mock.calls[0][0];
    expect(arg.description).toEqual(DUMMY_DATA.description);
    expect(arg.shootDate).toEqual(DUMMY_DATA.shootDate);
    expect(arg.lng).toEqual(DUMMY_DATA.lng);
    expect(arg.lat).toEqual(DUMMY_DATA.lat);
  });
});
