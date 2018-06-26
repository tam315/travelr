import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import ReactCompareImage from 'react-compare-image';
import { PageViewPost } from '../PageViewPost';
import StatusBadge from '../StatusBadge';

jest.mock('../StatusBadge');

// url params
const match = { params: { postId: 12345 } };

// dummy data from the API
const dummyPost = {
  oldImageUrl: 'dummy_oldImageUrl',
  newImageUrl: 'dummy_newImageUrl',
  description: 'dummy_description',
  shootDate: '1999-09-09',
  lng: 'dummy_lng',
  lat: 'dummy_lat',
  viewCount: 'dummy_viewCount',
  displayName: 'dummy_displayName',
  likedCount: 'dummy_likedCount',
  commentsCount: 'dummy_commentsCount',
  comments: [
    {
      commentId: 123,
      userId: 456,
      datetime: new Date('1985-03-31'),
      comment: 'dummy_comment',
    },
  ],
};

describe('PageViewPost component', () => {
  let wrapper;

  beforeEach(() => {
    fetch.resetMocks();

    wrapper = shallow(<PageViewPost classes={{}} match={match} user={{}} />);
    wrapper.setState({
      post: dummyPost,
    });
  });

  test('fetch post when componentDidMount', () => {
    expect(fetch).toBeCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain(`/posts/${match.params.postId}`);
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
    ).toContain(dummyPost.displayName);
    // description
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .html(),
    ).toContain(dummyPost.description);
    // shootDate
    expect(
      wrapper
        .find(Typography)
        .at(2)
        .html(),
    ).toContain(dummyPost.shootDate);
    // comment writing form
    expect(wrapper.find({ placeholder: 'コメントを書く' })).toHaveLength(1);
    // comments
    expect(wrapper.find({ className: 'comment' }).html()).toContain(
      dummyPost.comments[0].comment,
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

  test('sends a comment and fetches post if success', done => {
    fetch.mockResponse();

    // user write a comment
    wrapper
      .find({ placeholder: 'コメントを書く' })
      .simulate('change', { target: { value: 'cat' } });

    // user pressed send button
    wrapper.find(Button).simulate('click');

    setImmediate(() => {
      expect(fetch).toHaveBeenCalledTimes(3);

      // 1st time => initial fetchPost
      // 2nd time => post comment
      expect(fetch.mock.calls[1][0]).toContain(
        `/posts/${match.params.postId}/comments`,
      );
      expect(fetch.mock.calls[1][1].method).toBe('POST');
      // 3rd time => fetchPost
      expect(fetch.mock.calls[2][0]).toContain(`/posts/${match.params.postId}`);
      done();
    });
  });
});
