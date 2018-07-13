// @flow
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import IconGrid from '@material-ui/icons/GridOn';
import IconMap from '@material-ui/icons/Place';
import IconSearch from '@material-ui/icons/Search';
import React from 'react';
import Filter from './Filter';
import PageViewPostsGrid from './PageViewPostsGrid';
import PageViewPostsMap from './PageViewPostsMap';
import type { Location, RouterHistory } from 'react-router-dom';
import type { FilterCriterion, PostsStore } from '../config/types';

const styles = {
  tabsFlexContainer: {
    justifyContent: 'center',
  },
  filterButton: {
    position: 'fixed',
    bottom: 28,
    right: 16,
  },
};

const pathTabnumberMapping = {
  '/all-grid': 0,
  '/all-map': 1,
};

type Props = {
  classes: any,
  fetchAllPosts(criterion: FilterCriterion): any,
  increaseLimitCountOfGrid: void => void,
  history: RouterHistory,
  location: Location,
  posts: PostsStore,
};

type State = {
  tabNumber: number,
  isFilterOpen: boolean,
};

export class PageViewPosts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      location: { pathname },
    } = this.props;

    // switch child component based on pathname
    const defaultTabNumber = pathTabnumberMapping[pathname];

    this.state = {
      tabNumber: defaultTabNumber,
      isFilterOpen: false,
    };
  }

  componentDidMount = () => {
    const { fetchAllPosts } = this.props;
    fetchAllPosts();
  };

  componentDidUpdate = prevProps => {
    const {
      location: { pathname },
    } = this.props;

    if (pathname !== prevProps.location.pathname) {
      this.setState({
        tabNumber: pathTabnumberMapping[pathname],
      });
    }
  };

  handleTabChange = (event: SyntheticEvent<HTMLElement>, tabNumber: number) => {
    const { history } = this.props;

    this.setState({
      tabNumber,
    });

    let redirectTo;
    if (tabNumber === 0) redirectTo = '/all-grid';
    if (tabNumber === 1) redirectTo = '/all-map';

    // synchronize URL with the currently displayed component
    if (redirectTo) history.push(redirectTo);
  };

  render() {
    const {
      classes,
      posts: { all, limitCountOfGrid },
      increaseLimitCountOfGrid,
    } = this.props;

    const { tabNumber, isFilterOpen } = this.state;

    return (
      <React.Fragment>
        <Paper>
          <Tabs
            value={tabNumber}
            onChange={this.handleTabChange}
            fullWidth
            indicatorColor="primary"
            textColor="primary"
            classes={{
              flexContainer: classes.tabsFlexContainer,
            }}
          >
            <Tab icon={<IconGrid />} />
            <Tab icon={<IconMap />} />
          </Tabs>
        </Paper>

        {/* grid view */}
        {tabNumber === 0 && (
          <div>
            <PageViewPostsGrid
              posts={all}
              limitCountOfGrid={limitCountOfGrid}
              increaseLimitCountOfGrid={increaseLimitCountOfGrid}
            />
          </div>
        )}

        {/* map view */}
        {tabNumber === 1 && <PageViewPostsMap posts={all} />}

        {/* filter */}
        <Filter
          isOpen={isFilterOpen}
          onClose={(criterion: FilterCriterion) => {
            this.setState({ isFilterOpen: false });
            // TODO: call fetchAllPosts
            // eslint-disable-next-line
            console.log(criterion);
          }}
        />

        {/* filter button */}
        <Button
          aria-label="search"
          className={classes.filterButton}
          color="primary"
          disabled={isFilterOpen}
          onClick={() => this.setState({ isFilterOpen: !isFilterOpen })}
          variant="fab"
        >
          <IconSearch />
        </Button>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PageViewPosts);
