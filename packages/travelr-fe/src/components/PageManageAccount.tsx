import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconDone from '@material-ui/icons/Done';
import IconEdit from '@material-ui/icons/Edit';
import * as React from 'react';
import StatusBadge from './StatusBadge';
import { UserStore, NewUserInfo } from '../config/types';

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
  classes: any;
  user: UserStore;
  updateUserInfo: (user: UserStore, newUserInfo: NewUserInfo) => void;
  signOutUser: any;
  deleteUser: (user: UserStore) => void;
  sendEmailVerification: any;
};

type State = {
  isEditMode: boolean;
  displayName: string;
};

export class PageManageAccount extends React.Component<Props, State> {
  state = {
    isEditMode: false,
    displayName: '',
  };

  // @ts-ignore
  componentDidMount = async () => {
    const {
      user: { displayName },
    } = this.props;

    this.setState({
      displayName,
    });
  };

  // @ts-ignore
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

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  handleSendEmailVerification = () => {
    const { sendEmailVerification } = this.props;
    sendEmailVerification();
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
        <Typography
          // @ts-ignore
          dataenzyme="displayName"
        >
          {displayName}
        </Typography>
        <IconEdit onClick={() => this.setState({ isEditMode: true })} />
      </div>
    );
  };

  renderEmailVerificationStatus = () => {
    const { classes, user } = this.props;

    return (
      <div className={classes.nameContainer}>
        <Typography
          // @ts-ignore
          dataenzyme="emailVerified"
        >
          メール認証：
          {user.emailVerified ? '認証済み' : '未認証（画像の投稿ができません）'}
        </Typography>

        {!user.emailVerified && (
          <Typography
            // @ts-ignore
            dataenzyme="sendEmailVerification"
            color="secondary"
            style={{ cursor: 'pointer' }}
            onClick={this.handleSendEmailVerification}
          >
            認証メールを再送する
          </Typography>
        )}
      </div>
    );
  };

  render() {
    const { classes, user } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="title">アカウント管理</Typography>

        {this.renderNameContainer()}
        {this.renderEmailVerificationStatus()}

        <div className={classes.badges}>
          <StatusBadge icon="like" count={user.earnedLikes} />
          <StatusBadge icon="comment" count={user.earnedComments} />
          <StatusBadge icon="view" count={user.earnedViews} />
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
