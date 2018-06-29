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
};

const PageAuth = (props: Props) => {
  const { classes } = props;

  return (
    <div>
      <Grid
        container
        direction="column"
        alignItems="stretch"
        className={classes.container}
      >
        <div className={classes.spacer} />
        <Typography align="center">サインインして写真を投稿しよう！</Typography>
        <div className={classes.spacer} />

        <MuiThemeProvider theme={googleTheme}>
          <Button size="large" variant="contained" color="primary">
            <Typography color="inherit">Googleでサインイン</Typography>
          </Button>
        </MuiThemeProvider>

        <div className={classes.spacer} />

        <MuiThemeProvider theme={facebookTheme}>
          <Button size="large" variant="contained" color="primary">
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

export default withStyles(styles)(PageAuth);
