import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import IconGrid from '@material-ui/icons/GridOn';
import IconMap from '@material-ui/icons/Place';
import IconSearch from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import React from 'react';
import Filter from './Filter';
import PageViewPostsGrid from './PageViewPostsGrid';
import PageViewPostsMap from './PageViewPostsMap';

const propTypes = {
  classes: PropTypes.object.isRequired,
  fetchAllPosts: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  posts: PropTypes.object,
};

const defaultProps = {
  posts: {},
};

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

const tabNumberPathMapping = {
  0: '/all-grid',
  1: '/all-map',
};

export class PageViewPosts extends React.Component {
  constructor(props) {
    super(props);

    const { pathname } = this.props.location;

    // switch child component based on pathname
    let defaultTabNumber = 0;
    if (pathname === tabNumberPathMapping[0]) defaultTabNumber = 0;
    if (pathname === tabNumberPathMapping[1]) defaultTabNumber = 1;

    this.state = {
      tabNumber: defaultTabNumber,
      isFilterOpen: false,
    };
  }

  componentDidMount = () => {
    this.props.fetchAllPosts({ limit: 100 });
  };

  handleTabChange = (event, tabNumber) => {
    this.setState({
      tabNumber,
    });
    // synchronize URL with the currently displayed component
    this.props.history.push(tabNumberPathMapping[tabNumber]);
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
          onClose={() => this.setState({ isFilterOpen: false })}
        />

        {/* filter button */}
        <Button
          aria-label="search"
          className={classes.filterButton}
          color="primary"
          disabled={this.state.isFilterOpen}
          onClick={() => this.setState({ isFilterOpen: true })}
          variant="fab"
        >
          <IconSearch />
        </Button>
      </div>
    );
  }
}

PageViewPosts.propTypes = propTypes;
PageViewPosts.defaultProps = defaultProps;

export default withStyles(styles)(PageViewPosts);
