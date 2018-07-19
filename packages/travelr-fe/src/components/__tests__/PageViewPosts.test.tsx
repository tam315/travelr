import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DUMMY_POSTS_STORE } from '../../config/dummies';
import { PageViewPosts } from '../PageViewPosts';
import PageViewPostsGrid from '../PageViewPostsGrid';
import PageViewPostsMap from '../PageViewPostsMap';

describe('PageViewPosts component', () => {
  test('fetch all posts when componentDidMount', () => {
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <PageViewPosts
        fetchAllPosts={mockCallback}
        classes={{}}
        // @ts-ignore
        location={{}}
        // @ts-ignore
        history={{}}
        posts={{ ...DUMMY_POSTS_STORE, all: [] }}
      />,
    );
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('shows grid when pathname is /all-grid', () => {
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <PageViewPosts
        fetchAllPosts={mockCallback}
        classes={{}}
        // @ts-ignore
        location={{ pathname: '/all-grid' }}
        // @ts-ignore
        history={{}}
        posts={{ ...DUMMY_POSTS_STORE, all: [] }}
      />,
    );
    expect(wrapper.find(PageViewPostsGrid)).toHaveLength(1);
  });

  test('shows map when pathname is /all-map', () => {
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <PageViewPosts
        fetchAllPosts={mockCallback}
        classes={{}}
        // @ts-ignore
        location={{ pathname: '/all-map' }}
        // @ts-ignore
        history={{}}
        posts={{ ...DUMMY_POSTS_STORE, all: [] }}
      />,
    );
    expect(wrapper.find(PageViewPostsMap)).toHaveLength(1);
  });

  test('show filter button when the filter menu is not displayed', () => {
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <PageViewPosts
        fetchAllPosts={mockCallback}
        classes={{}}
        // @ts-ignore
        location={{ pathname: '/all-map' }}
        // @ts-ignore
        history={{}}
        posts={{ ...DUMMY_POSTS_STORE, all: [] }}
      />,
    );

    // button is enabled initially
    expect(wrapper.find(Button).props().disabled).toBe(false);

    // button is disables when filter is opened
    wrapper.setState({ isFilterOpen: true });
    wrapper.update();
    expect(wrapper.find(Button).props().disabled).toBe(true);
  });
});
