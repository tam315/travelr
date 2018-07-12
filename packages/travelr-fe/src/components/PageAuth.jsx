// @flow
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
  signInWithGoogle: () => any,
  signInWithFacebook: () => any,
  signInWithEmail: (email: string, password: string) => any,
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string,
  ) => any,
};

type State = {
  mailAuthMode: 'signin' | 'signup',
  displayName: string,
  email: string,
  password: string,
};

export class PageAuth extends React.Component<Props, State> {
  state = {
    mailAuthMode: 'signup',
    displayName: '',
    email: '',
    password: '',
  };

  signInWithGoogle = () => {
    this.props.signInWithGoogle();
  };

  signInWithFacebook = async () => {
    this.props.signInWithFacebook();
  };

  signInWithEmail = async () => {
    const { email, password } = this.state;
    this.props.signInWithEmail(email, password);
  };

  signUpWithEmail = async () => {
    const { email, password, displayName } = this.state;

    this.props.signUpWithEmail(email, password, displayName);
  };

  handleChange(e: SyntheticInputEvent<>, stateKayName: string) {
    e.preventDefault();
    this.setState({ [stateKayName]: e.target.value });
  }

  renderSignUp = () => {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <TextField
          label="ニックネーム"
          margin="normal"
          value={this.state.displayName}
          onChange={e => this.handleChange(e, 'displayName')}
        />

        <TextField
          label="メールアドレス"
          margin="normal"
          value={this.state.email}
          onChange={e => this.handleChange(e, 'email')}
        />
        <TextField
          label="パスワード"
          type="password"
          margin="normal"
          value={this.state.password}
          onChange={e => this.handleChange(e, 'password')}
        />

        <div className={classes.spacer} />

        <Button
          size="large"
          variant="contained"
          color="default"
          onClick={this.signUpWithEmail}
        >
          <Typography color="inherit">メールアドレスでサインアップ</Typography>
        </Button>

        <div className={classes.spacer} />

        <Typography
          color="secondary"
          onClick={() => this.setState({ mailAuthMode: 'signin' })}
          align="center"
          style={{ cursor: 'pointer' }}
        >
          メールでサインインはこちら
        </Typography>
      </React.Fragment>
    );
  };

  renderSignIn = () => {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <TextField
          label="メールアドレス"
          margin="normal"
          value={this.state.email}
          onChange={e => this.handleChange(e, 'email')}
        />
        <TextField
          label="パスワード"
          type="password"
          margin="normal"
          value={this.state.password}
          onChange={e => this.handleChange(e, 'password')}
        />

        <div className={classes.spacer} />

        <Button
          size="large"
          variant="contained"
          color="default"
          onClick={this.signInWithEmail}
        >
          <Typography color="inherit">メールアドレスでサインイン</Typography>
        </Button>
      </React.Fragment>
    );
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

          {this.state.mailAuthMode === 'signup' && this.renderSignUp()}
          {this.state.mailAuthMode === 'signin' && this.renderSignIn()}
        </Grid>
      </div>
    );
  };
}

export default withStyles(styles)(PageAuth);
