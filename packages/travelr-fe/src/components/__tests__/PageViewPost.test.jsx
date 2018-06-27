import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { shallow } from 'enzyme';
import React from 'react';
import ReactCompareImage from 'react-compare-image';
import { DUMMY_POSTS } from '../../config/dummies';
import { PageViewPost } from '../PageViewPost';
import StatusBadge from '../StatusBadge';

jest.mock('../StatusBadge');

// url params
const match = { params: { postId: 12345 } };

// dummy data from the API
const DUMMY_POST = DUMMY_POSTS[0];

describe('PageViewPost component', () => {
  let wrapper;

  beforeEach(() => {
    fetch.resetMocks();

    wrapper = shallow(<PageViewPost classes={{}} match={match} user={{}} />);
    wrapper.setState({
      post: DUMMY_POST,
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
    // comment writing form
    expect(wrapper.find({ placeholder: 'コメントを書く' })).toHaveLength(1);
    // comments
    expect(wrapper.find({ className: 'comment' }).html()).toContain(
      DUMMY_POST.comments[0].comment,
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
