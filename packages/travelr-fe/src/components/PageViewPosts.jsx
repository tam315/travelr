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

    const { pathname } = this.props.location;

    // switch child component based on pathname
    const defaultTabNumber = pathTabnumberMapping[pathname];

    this.state = {
      tabNumber: defaultTabNumber,
      isFilterOpen: false,
    };
  }

  componentDidMount = () => {
    this.props.fetchAllPosts({ limit: 100 });
  };

  handleTabChange = (event: SyntheticEvent<HTMLElement>, tabNumber: number) => {
    this.setState({
      tabNumber,
    });

    let redirectTo;
    if (tabNumber === 0) redirectTo = '/all-grid';
    if (tabNumber === 1) redirectTo = '/all-map';

    // synchronize URL with the currently displayed component
    if (redirectTo) this.props.history.push(redirectTo);
  };

  render() {
    const {
      classes,
      posts: { all },
    } = this.props;
    return (
      <div>
        <Paper>
          <Tabs
            value={this.state.tabNumber}
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
        {this.state.tabNumber === 0 && (
          <div>
            <PageViewPostsGrid posts={all} />
          </div>
        )}

        {/* map view */}
        {this.state.tabNumber === 1 && <PageViewPostsMap posts={all} />}

        {/* filter */}
        <Filter
          isOpen={this.state.isFilterOpen}
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
          disabled={this.state.isFilterOpen}
          onClick={() =>
            this.setState({ isFilterOpen: !this.state.isFilterOpen })
          }
          variant="fab"
        >
          <IconSearch />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(PageViewPosts);
