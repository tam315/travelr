import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PageViewPosts } from '../PageViewPosts';
import PageViewPostsGrid from '../PageViewPostsGrid';
import PageViewPostsMap from '../PageViewPostsMap';

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

  test('show filter button when the filter menu is not displayed', () => {
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

    const component = wrapper.find(PageViewPosts).dive();

    // button is enabled initially
    expect(component.find(Button).props().disabled).toBe(false);

    // button is disables when filter is opened
    component.setState({ isFilterOpen: true });
    wrapper.update();
    expect(component.find(Button).props().disabled).toBe(true);
  });
});
