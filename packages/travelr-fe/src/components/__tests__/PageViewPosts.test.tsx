import { Button } from '@material-ui/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DUMMY_POSTS_STORE } from '../../config/dummies';
import { PageViewPosts } from '../PageViewPosts';
import PageViewPostsGrid from '../PageViewPostsGrid';
import PageViewPostsMap from '../PageViewPostsMap';

describe('PageViewPosts component', () => {
  let mock;
  let wrapper;

  beforeEach(() => {
    jest.resetAllMocks();

    mock = {
      actions: {
        fetchAllPosts: jest.fn(),
        increaseLimitCountOfGrid: jest.fn(),
        getFilterSelectorRange: jest.fn(),
        updateFilterCriterion: jest.fn(),
      },
    };

    wrapper = shallow(
      <PageViewPosts
        fetchAllPosts={mock.actions.fetchAllPosts}
        increaseLimitCountOfGrid={mock.actions.increaseLimitCountOfGrid}
        getFilterSelectorRange={mock.actions.getFilterSelectorRange}
        updateFilterCriterion={mock.actions.updateFilterCriterion}
        classes={{}}
        // @ts-ignore
        location={{}}
        // @ts-ignore
        history={{}}
        posts={{ ...DUMMY_POSTS_STORE, all: [] }}
      />,
    );
  });

  test('inital setup is excuted when componentDidMount', () => {
    expect(mock.actions.fetchAllPosts).toHaveBeenCalledTimes(1);
    expect(mock.actions.getFilterSelectorRange).toHaveBeenCalledTimes(1);
  });

  test('shows grid when pathname is /all-grid', () => {
    const wrapper = shallow(
      <PageViewPosts
        fetchAllPosts={mock.actions.fetchAllPosts}
        increaseLimitCountOfGrid={mock.actions.increaseLimitCountOfGrid}
        getFilterSelectorRange={mock.actions.getFilterSelectorRange}
        updateFilterCriterion={mock.actions.updateFilterCriterion}
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
        fetchAllPosts={mock.actions.fetchAllPosts}
        increaseLimitCountOfGrid={mock.actions.increaseLimitCountOfGrid}
        getFilterSelectorRange={mock.actions.getFilterSelectorRange}
        updateFilterCriterion={mock.actions.updateFilterCriterion}
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
    // button is enabled initially
    expect(wrapper.find(Button).props().disabled).toBe(false);

    // button is disables when filter is opened
    wrapper.setState({ isFilterOpen: true });
    wrapper.update();
    expect(wrapper.find(Button).props().disabled).toBe(true);
  });

  test('updateFilterCriterion() is called when user did filter', () => {
    wrapper.instance().handleFilter();
    expect(mock.actions.updateFilterCriterion).toBeCalled();
  });
});
