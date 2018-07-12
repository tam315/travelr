// @flow
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconDone from '@material-ui/icons/Done';
import IconEdit from '@material-ui/icons/Edit';
import React from 'react';
import StatusBadge from './StatusBadge';
import type { UserStore, NewUserInfo } from '../config/types';

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

type Props = {
  classes: any,
  user: UserStore,
  updateUserInfo: (user: UserStore, newUserInfo: NewUserInfo) => void,
  signOutUser: void => any,
  deleteUser: (user: UserStore) => void,
};

type State = {
  isEditMode: boolean,
  displayName: string,
};

export class PageManageAccount extends React.Component<Props, State> {
  state = {
    isEditMode: false,
    displayName: '',
  };

  componentDidMount = async () => {
    const {
      user: { displayName },
    } = this.props;

    this.setState({
      displayName,
    });
  };

  componentDidUpdate = (prevProps: Props) => {
    const { user } = this.props;
    // because the user information may not be fetched yet
    // when this component is mounted.
    const prevName = prevProps.user.displayName;
    const currentName = user.displayName;

    if (prevName !== currentName) {
      this.setState({ displayName: currentName });
    }
  };

  handleChange = (e: SyntheticInputEvent<>) => {
    this.setState({
      displayName: e.target.value,
    });
  };

  handleDisplayNameChange = () => {
    const { updateUserInfo } = this.props;
    const { displayName } = this.state;
    this.setState({ isEditMode: false });

    const { user } = this.props;
    const newUserInfo = {
      displayName,
    };
    updateUserInfo(user, newUserInfo);
  };

  handeSignOutUser = () => {
    const { signOutUser } = this.props;
    signOutUser();
  };

  handleDeleteUser = async () => {
    const { user, deleteUser } = this.props;
    deleteUser(user);
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
        <Typography dataEnzyme="displayName">{displayName}</Typography>
        <IconEdit onClick={() => this.setState({ isEditMode: true })} />
      </div>
    );
  };

  render() {
    const { classes, user } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="title">アカウント管理</Typography>

        {this.renderNameContainer()}

        <Typography dataEnzyme="emailVerified">
          メール認証：
          {user.emailVerified ? '認証済み' : '未認証（画像の投稿ができません）'}
        </Typography>

        <div className={classes.badges}>
          <StatusBadge icon="like" count={1} />
          <StatusBadge icon="comment" count={2} />
          <StatusBadge icon="view" count={3} />
        </div>

        <Typography
          color="secondary"
          variant="body2"
          onClick={this.handeSignOutUser}
          style={{ cursor: 'pointer' }}
        >
          サインアウトする
        </Typography>

        <Typography
          color="secondary"
          variant="body2"
          onClick={this.handleDeleteUser}
          style={{ cursor: 'pointer' }}
        >
          アカウントを削除する
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(PageManageAccount);
