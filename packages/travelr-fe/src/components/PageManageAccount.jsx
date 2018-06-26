import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconDone from '@material-ui/icons/Done';
import IconEdit from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import React from 'react';
import StatusBadge from './StatusBadge';

const propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  updateUserInfo: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

const defaultProps = {};

const styles = theme => ({
  root: {
    display: 'grid',
    gridGap: `${theme.spacing.unit * 3}px`,
    margin: 'auto',
    marginTop: `${theme.spacing.unit * 4}px`,
    maxWidth: 500,
    paddingBottom: theme.spacing.unit * 4,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    height: 32,
    '& svg': {
      alignSelf: 'center',
      height: 20,
      marginLeft: theme.spacing.unit * 1,
    },
  },
  badges: {
    display: 'grid',
    gridGap: `${theme.spacing.unit * 2}px`,
    gridTemplateColumns: '1fr 1fr 1fr',
  },
});

export class PageManageAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditMode: false,
      displayName: props.user.displayName,
    };
  }

  componentDidMount = async () => {};

  componentDidUpdate = prevProps => {
    // because the user information may not be fetched yet
    // when this component is mounted.
    const prevName = prevProps.user.displayName;
    const currentName = this.props.user.displayName;

    if (prevName !== currentName) {
      this.setState({ displayName: currentName });
    }
  };

  handleChange = e => {
    this.setState({
      displayName: e.target.value,
    });
  };

  handleDisplayNameChange = () => {
    this.setState({ isEditMode: false });

    const { user } = this.props;
    const newUserInfo = {
      displayName: this.state.displayName,
    };
    this.props.updateUserInfo(user, newUserInfo);
  };

  handleDeleteUser = () => {
    const callback = () => {
      alert('アカウントを削除しました'); // TODO: toast
      this.props.history.push('/');
    };

    if (confirm('本当に削除してよろしいですか？')) {
      // TODO: dialog
      this.props.deleteUser(this.props.user, callback);
    }
  };

  renderNameContainer = () => {
    const { classes } = this.props;
    const { isEditMode, displayName } = this.state;

    if (isEditMode) {
      return (
        <div className={classes.nameContainer}>
          <Typography>ユーザ名：</Typography>
          <Input value={displayName} onChange={this.handleChange} />
          <IconDone onClick={this.handleDisplayNameChange} />
        </div>
      );
    }

    return (
      <div className={classes.nameContainer}>
        <Typography>ユーザ名：</Typography>
        <Typography variant="subheading">{displayName}</Typography>
        <IconEdit onClick={() => this.setState({ isEditMode: true })} />
      </div>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="title">アカウント管理</Typography>

        {this.renderNameContainer()}
        <div className={classes.badges}>
          <StatusBadge icon="like" count={1} />
          <StatusBadge icon="comment" count={2} />
          <StatusBadge icon="view" count={3} />
        </div>
        <Typography
          color="secondary"
          variant="body2"
          onClick={this.handleDeleteUser}
        >
          アカウントを削除する
        </Typography>
      </div>
    );
  }
}

PageManageAccount.propTypes = propTypes;
PageManageAccount.defaultProps = defaultProps;

export default withStyles(styles)(PageManageAccount);
