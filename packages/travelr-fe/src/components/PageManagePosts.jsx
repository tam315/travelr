import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconCancel from '@material-ui/icons/Cancel';
import IconDelete from '@material-ui/icons/Delete';
import IconSelectAll from '@material-ui/icons/SelectAll';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
  fetchMyPosts: PropTypes.func.isRequired,
  deleteMyPosts: PropTypes.func.isRequired,
  selectMyPosts: PropTypes.func.isRequired,
  selectMyPostsAll: PropTypes.func.isRequired,
  selectMyPostsReset: PropTypes.func.isRequired,
};

const defaultProps = {};

const styles = theme => ({
  root: {
    margin: 'auto',
    maxWidth: 500,
  },
  container: {
    marginTop: `${theme.spacing.unit * 4}px`,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    maxWidth: '100%',
  },
  titleAndMenu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    height: 48,
    width: 48,
    objectFit: 'cover',
    flex: '0 0 auto',
  },
  badgesContainer: {
    display: 'grid',
    flex: '1 0 0',
    gridTemplateColumns: '30% 30% 40%',
    margin: 'auto',
    maxWidth: 300,
    paddingLeft: 12,
    paddingRight: 12,
  },
});

export class PageManagePosts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuAnchorElement: null,
    };
  }

  componentDidMount = () => {
    this.props.fetchMyPosts(this.props.user);
  };

  componentDidUpdate = prevProps => {
    if (prevProps.user.userId !== this.props.user.userId) {
      this.props.fetchMyPosts(this.props.user);
    }
  };

  onSelectMyPostsAll = () => {
    this.handleMenuClose();
    this.props.selectMyPostsAll();
  };

  onSelectMyPostsReset = () => {
    this.handleMenuClose();
    this.props.selectMyPostsReset();
  };

  onDeleteMyPosts = () => {
    const {
      user,
      posts: { myPostsSelected },
    } = this.props;

    this.handleMenuClose();
    this.props.deleteMyPosts(user, myPostsSelected);
  };

  handleMenuClose = () => {
    this.setState({ menuAnchorElement: null });
  };

  handleMenuButtonClick = event => {
    this.setState({ menuAnchorElement: event.currentTarget });
  };

  renderMenu = () => {
    const { menuAnchorElement } = this.state;
    const options = [
      {
        title: 'すべて選択',
        icon: <IconSelectAll />,
        callback: this.onSelectMyPostsAll,
      },
      {
        title: '選択を解除',
        icon: <IconCancel />,
        callback: this.onSelectMyPostsReset,
      },
      {
        title: '選択した投稿を削除',
        icon: <IconDelete />,
        callback: this.onDeleteMyPosts,
      },
    ];
    return (
      <React.Fragment>
        <Button
          onClick={this.handleMenuButtonClick}
          color="primary"
          variant="contained"
        >
          一括
        </Button>
        <Menu
          anchorEl={menuAnchorElement}
          open={Boolean(menuAnchorElement)}
          onClose={this.handleMenuClose}
        >
          {options.map(option => (
            <MenuItem key={option.title} onClick={option.callback}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText inset primary={option.title} />
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  };

  renderPosts = () => {
    const {
      classes,
      posts: { myPosts, myPostsSelected },
      selectMyPosts,
    } = this.props;

    if (!myPosts) return false;

    return (
      <List>
        <Divider />
        {myPosts.map(post => (
          <ListItem
            key={post.postId}
            dense
            button
            divider
            component={Link}
            to={`/post/${post.postId}`}
          >
            <img
              src={post.oldImageUrl}
              alt={post.description}
              className={classes.image}
            />
            <div className={classes.badgesContainer}>
              <StatusBadge
                icon="like"
                count={post.likedCount}
                noBorder
                iconMargin={8}
                dense
              />
              <StatusBadge
                icon="comment"
                count={post.commentsCount}
                noBorder
                iconMargin={8}
                dense
              />
              <StatusBadge
                icon="view"
                count={post.viewCount}
                noBorder
                iconMargin={8}
                dense
              />
            </div>
            <ListItemSecondaryAction>
              <Checkbox
                onChange={() => selectMyPosts([post.postId])}
                checked={myPostsSelected.indexOf(post.postId) !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <div className={classes.container}>
            <div className={classes.titleAndMenu}>
              <Typography variant="title">投稿管理</Typography>
              {this.renderMenu()}
            </div>
          </div>
          {this.renderPosts()}
        </div>
      </React.Fragment>
    );
  }
}

PageManagePosts.propTypes = propTypes;
PageManagePosts.defaultProps = defaultProps;

export default withStyles(styles)(PageManagePosts);
