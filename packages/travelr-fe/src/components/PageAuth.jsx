// @flow
import firebase from 'firebase/app';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Hr from './Hr';
import store from 'store';

const googleTheme = createMuiTheme({
  palette: {
    primary: { main: '#DB4437' }, // Purple and green play nicely together.
  },
});

const facebookTheme = createMuiTheme({
  palette: {
    primary: { main: '#3B5998' }, // Purple and green play nicely together.
  },
});

const styles = theme => ({
  container: {
    width: '280px',
    margin: 'auto',
  },
  spacer: {
    marginTop: theme.spacing.unit * 4,
  },
});

type Props = {
  classes: any,
  getOrCreateUserInfo: (token: string, displayName?: string) => void,
};

export class PageAuth extends React.Component<Props> {
  componentDidMount = async () => {
    await this.handleRedirectResults();
  };

  handleRedirectResults = async () => {
    try {
      const result = await firebase.auth().getRedirectResult();
      if (!result.user) return;

      const token = await firebase.auth().currentUser.getIdToken();
      store.set('token', token);

      const displayName = result.additionalUserInfo.profile.given_name;
      await this.props.getOrCreateUserInfo(token, displayName);
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        throw new Error(
          'このメールアドレスは別のログイン方法に紐づけされています',
        ); // TODO: link account, snackbar
      }
      throw new Error(err);
    }
  };

  signInWithGoogle = async () => {
    store.remove('token');
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    await firebase.auth().signInWithRedirect(provider);
  };

  signInWithFacebook = async () => {
    store.remove('token');
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    await firebase.auth().signInWithRedirect(provider);
  };

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          className={classes.container}
        >
          <div className={classes.spacer} />
          <Typography align="center">
            サインインして写真を投稿しよう！
          </Typography>
          <div className={classes.spacer} />

          <MuiThemeProvider theme={googleTheme}>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={this.signInWithGoogle}
            >
              <Typography color="inherit">Googleでサインイン</Typography>
            </Button>
          </MuiThemeProvider>

          <div className={classes.spacer} />

          <MuiThemeProvider theme={facebookTheme}>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={this.signInWithFacebook}
            >
              <Typography color="inherit">Facebookでサインイン</Typography>
            </Button>
          </MuiThemeProvider>

          <div className={classes.spacer} />
          <Hr text="or" />

          <TextField label="メールアドレス" margin="normal" />
          <TextField label="パスワード" type="password" margin="normal" />

          <div className={classes.spacer} />

          <Button size="large" variant="contained" color="default">
            <Typography color="inherit">メールアドレスでサインイン</Typography>
          </Button>
        </Grid>
      </div>
    );
  };
}

export default withStyles(styles)(PageAuth);
