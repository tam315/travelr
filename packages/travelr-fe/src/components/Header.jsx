import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';

const styles = {
  title: {
    flexGrow: 1,
    marginLeft: 10,
  },
  accountCircle: {
    marginRight: 10,
  },
  userName: {
    marginRight: 10,
  },
  menuButton: {
    marginLeft: 0,
    marginRight: 0,
  },
};

function Header(props) {
  const {
    classes,
    user: { userId },
  } = props;

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="title" color="inherit" className={classes.title}>
          Travelr
        </Typography>

        {userId ? (
          <React.Fragment>
            <AccountCircle className={classes.accountCircle} />
            <Typography
              variant="body1"
              color="inherit"
              className={classes.userName}
            >
              {userId}
            </Typography>
          </React.Fragment>
        ) : (
          <Button color="inherit">Signup / In</Button>
        )}

        <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(Header);
