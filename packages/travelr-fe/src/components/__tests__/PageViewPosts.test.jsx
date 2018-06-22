import { shallow } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { _PageViewPosts as PageViewPosts } from '../PageViewPosts';
import PageViewPostsGrid from '../PageViewPostsGrid';
import PageViewPostsMap from '../PageViewPostsMap';

jest.mock('../PageViewPostsGrid');
jest.mock('../PageViewPostsMap');

describe('PageViewPosts component', () => {
  test('fetch all posts when componentDidMount', () => {
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <BrowserRouter>
        <PageViewPosts
          fetchAllPosts={mockCallback}
          classes={{}}
          location={{}}
          history={{}}
        />
      </BrowserRouter>,
    );
    wrapper.find(PageViewPosts).dive();
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('shows grid when pathname is /all-grid', () => {
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <BrowserRouter>
        <PageViewPosts
          fetchAllPosts={mockCallback}
          classes={{}}
          location={{ pathname: '/all-grid' }}
          history={{}}
        />
      </BrowserRouter>,
    );
    expect(
      wrapper
        .find(PageViewPosts)
        .dive()
        .find(PageViewPostsGrid),
    ).toHaveLength(1);
  });

  test('shows map when pathname is /all-map', () => {
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <BrowserRouter>
        <PageViewPosts
          fetchAllPosts={mockCallback}
          classes={{}}
          location={{ pathname: '/all-map' }}
          history={{}}
        />
      </BrowserRouter>,
    );
    expect(
      wrapper
        .find(PageViewPosts)
        .dive()
        .find(PageViewPostsMap),
    ).toHaveLength(1);
  });
});
