import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import IconGrid from '@material-ui/icons/GridOn';
import IconMap from '@material-ui/icons/Place';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import actions from '../actions';
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
};

const tabNumberPathMapping = {
  0: '/all-grid',
  1: '/all-map',
};

export class _PageViewPosts extends React.Component {
  constructor(props) {
    super(props);

    const { pathname } = this.props.location;

    // switch child component based on pathname
    let defaultTabNumber = 0;
    if (pathname === tabNumberPathMapping[0]) defaultTabNumber = 0;
    if (pathname === tabNumberPathMapping[1]) defaultTabNumber = 1;

    this.state = {
      tabNumber: defaultTabNumber,
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
        {this.state.tabNumber === 0 && (
          <div>
            <PageViewPostsGrid posts={all} />
          </div>
        )}
        {this.state.tabNumber === 1 && <PageViewPostsMap />}
      </div>
    );
  }
}

_PageViewPosts.propTypes = propTypes;
_PageViewPosts.defaultProps = defaultProps;

export default compose(
  withStyles(styles),
  connect(
    // map everything to props
    state => state,
    actions,
  ),
)(_PageViewPosts);
