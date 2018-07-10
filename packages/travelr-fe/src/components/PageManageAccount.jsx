// @flow
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconDone from '@material-ui/icons/Done';
import IconEdit from '@material-ui/icons/Edit';
import React from 'react';
import firebaseUtils from '../utils/firebaseUtils';
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
  addSnackbarQueue: (message: string) => void,
};

type State = {
  isEditMode: boolean,
  displayName: string,
};

export class PageManageAccount extends React.Component<Props, State> {
  state = {
    isEditMode: false,
    displayName: this.props.user.displayName,
  };

  componentDidMount = async () => {};

  componentDidUpdate = (prevProps: Props) => {
    // because the user information may not be fetched yet
    // when this component is mounted.
    const prevName = prevProps.user.displayName;
    const currentName = this.props.user.displayName;

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
    this.setState({ isEditMode: false });

    const { user } = this.props;
    const newUserInfo = {
      displayName: this.state.displayName,
    };
    this.props.updateUserInfo(user, newUserInfo);
  };

  handeSignOutUser = () => {
    this.props.signOutUser();
  };

  handleDeleteUser = async () => {
    const canUserDeletedNow = await firebaseUtils.canUserDeletedNow();
    if (!canUserDeletedNow) {
      this.props.addSnackbarQueue(
        'アカウントを削除するには再認証が必要です。一度サインアウトしてから、もう一度サインインしたあとに、同じ操作を行ってください。',
      );
      return;
    }

    if (
      // TODO: dialog
      // eslint-disable-next-line
      confirm(
        '本当にアカウントを削除してよろしいですか？すべてのデータが失われます。',
      )
    ) {
      this.props.deleteUser(this.props.user);
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
