import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import Menu from './Menu';

const propTypes = {
  user: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const defaultProps = {
  user: {},
};

const styles = {
  title: {
    color: 'white',
  },
  spacer: {
    flexGrow: 1,
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

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
    };
  }

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
              onClick={this.toggleMenu}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Menu
          isOpen={this.state.isMenuOpen}
          onClose={this.toggleMenu}
          isUserAuthorized={isUserAuthorized}
        />

        {/* Dummy toolbar for padding. this toolbar is invisible */}
        <Toolbar />
      </React.Fragment>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default withStyles(styles)(Header);
