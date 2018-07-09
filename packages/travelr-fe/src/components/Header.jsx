// @flow
import {
  AppBar,
  Button,
  IconButton,
  Hidden,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import type { UserStore } from '../config/types';

const styles = theme => ({
  title: {
    color: 'white',
  },
  spacer: {
    flexGrow: 1,
  },
  accountButton: {
    minWidth: 0,
  },
  userName: {
    marginLeft: theme.spacing.unit * 1,
  },
  menuButton: {
    marginLeft: 0,
    marginRight: 0,
  },
});

type Props = {
  user: UserStore,
  classes: any,
};

type State = {
  isMenuOpen: boolean,
};

class Header extends React.Component<Props, State> {
  state = {
    isMenuOpen: false,
  };

  toggleMenu = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  };

  render() {
    const { classes, user } = this.props;
    const isUserAuthorized = !!user.userId;

    return (
      <React.Fragment>
        <AppBar>
          <Toolbar>
            <Button component={Link} to="/" className={classes.title}>
              <Typography variant="title" color="inherit">
                Travelr
              </Typography>
            </Button>

            <div className={classes.spacer} />

            {isUserAuthorized ? (
              <Button
                component={Link}
                to="/account"
                color="inherit"
                className={classes.accountButton}
              >
                <AccountCircle />
                <Hidden xsDown>
                  <Typography
                    variant="body2"
                    color="inherit"
                    className={classes.userName}
                  >
                    {user.displayName}
                  </Typography>
                </Hidden>
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
              onClick={this.toggleMenu}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Menu
          isOpen={this.state.isMenuOpen}
          onOpen={this.toggleMenu}
          onClose={this.toggleMenu}
          isUserAuthorized={isUserAuthorized}
        />

        {/* Dummy toolbar for padding. this toolbar is invisible */}
        <Toolbar />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Header);
