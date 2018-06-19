import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { Link } from 'react-router-dom';

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
  const { classes, user } = props;

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.title}>
            Travelr
          </Typography>

          {user && user.displayName ? (
            <Button component={Link} to="/account" color="inherit">
              <AccountCircle className={classes.accountCircle} />
              <Typography
                variant="body2"
                color="inherit"
                className={classes.userName}
              >
                {user.displayName}
              </Typography>
            </Button>
          ) : (
            <Button component={Link} to="/auth" color="inherit">
              Signup / In
            </Button>
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

      {/* Dummy toolbar for padding. this toolbar is invisible */}
      <Toolbar />
    </React.Fragment>
  );
}

export default withStyles(styles)(Header);
