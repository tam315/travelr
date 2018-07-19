import {
  AppBar,
  Button,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { UserStore } from '../config/types';
import Menu from './Menu';

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
  user: UserStore;
  classes: any;
};

type State = {
  isMenuOpen: boolean;
};

class Header extends React.Component<Props, State> {
  state = {
    isMenuOpen: false,
  };

  toggleMenu = () => {
    const { isMenuOpen } = this.state;
    this.setState({ isMenuOpen: !isMenuOpen });
  };

  render() {
    const { classes, user } = this.props;
    const { isMenuOpen } = this.state;
    const isUserAuthorized = !!user.userId;

    return (
      <React.Fragment>
        <AppBar>
          <Toolbar>
            <Button
              component={Link}
              // @ts-ignore
              to="/all-grid"
              className={classes.title}
            >
              <Typography variant="title" color="inherit">
                Travelr
              </Typography>
            </Button>

            <div className={classes.spacer} />

            {isUserAuthorized ? (
              <Button
                component={Link}
                // @ts-ignore
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
              <Button
                component={Link}
                // @ts-ignore
                to="/auth"
                color="inherit"
              >
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
          isOpen={isMenuOpen}
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
