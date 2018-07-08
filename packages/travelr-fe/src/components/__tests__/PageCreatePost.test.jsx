// @flow
import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import { DUMMY_USER_STORE } from '../../config/dummies';
import firebaseUtils from '../../utils/firebaseUtils';
import MapsPickPosition from '../../utils/MapsPickPosition';
import { PageCreatePost } from '../PageCreatePost';

jest.mock('../../utils/firebaseUtils');
jest.mock('../../utils/MapsPickPosition');

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

  test('MapsPickPosition is instantiated', async () => {
    wrapper.instance().mapRef = { current: {} };
    wrapper.instance().componentDidMount();
    expect(MapsPickPosition).toBeCalled();
  });

  test('set the state and the map position if getting position succeed', async () => {
    const DUMMY_GEOM = {
      coords: {
        longitude: 135.0,
        latitude: 35.0,
      },
    };
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn(callback => callback(DUMMY_GEOM)),
    };

    const instance = wrapper.instance();

    // mock MapsPickPosition class instance
    instance.mapsPickPosition = {
      setPosition: jest.fn(),
    };

    // simulate the success of getting position
    instance.getCurrentPosition();

    // should set the state
    expect(wrapper.state('lng')).toEqual(DUMMY_GEOM.coords.longitude);
    expect(wrapper.state('lat')).toEqual(DUMMY_GEOM.coords.latitude);

    // should set the position of the map
    expect(instance.mapsPickPosition.setPosition).toBeCalledWith({
      lng: DUMMY_GEOM.coords.longitude,
      lat: DUMMY_GEOM.coords.latitude,
    });
  });

  test('set the state if the pin position is changed', async () => {
    const DUMMY_POSITION = {
      lng: 135.0,
      lat: 35.0,
    };

    const instance = wrapper.instance();

    // simulate the success of getting position
    instance.handlePinPositionChange(DUMMY_POSITION);

    // should set the state
    expect(wrapper.state('lng')).toEqual(DUMMY_POSITION.lng);
    expect(wrapper.state('lat')).toEqual(DUMMY_POSITION.lat);
  });
});
