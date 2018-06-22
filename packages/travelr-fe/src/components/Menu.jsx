import Divider from '@material-ui/core/Divider';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconAccountCircle from '@material-ui/icons/AccountCircle';
import IconAddPhoto from '@material-ui/icons/AddAPhoto';
import IconPhotoLibrary from '@material-ui/icons/PhotoLibrary';
import IconViewList from '@material-ui/icons/ViewList';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const propTypes = {
  isOpen: PropTypes.bool,
  isUserAuthorized: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func.isRequired,
};

const defaultProps = {
  isOpen: false,
  isUserAuthorized: false,
  onClose: null,
};

function Menu(props) {
  const { isOpen, isUserAuthorized, onClose, onOpen } = props;

  const authorizedMenu = (
    <React.Fragment>
      <List>
        <ListItem button component={Link} to="/all-grid">
          <ListItemIcon>
            <IconPhotoLibrary />
          </ListItemIcon>
          <ListItemText primary="写真を見る" />
        </ListItem>
        <ListItem button component={Link} to="/post/create">
          <ListItemIcon>
            <IconAddPhoto />
          </ListItemIcon>
          <ListItemText primary="写真を投稿する" />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem button component={Link} to="/account">
          <ListItemIcon>
            <IconAccountCircle />
          </ListItemIcon>
          <ListItemText primary="アカウント管理" />
        </ListItem>
        <ListItem button component={Link} to="/account/posts">
          <ListItemIcon>
            <IconViewList />
          </ListItemIcon>
          <ListItemText primary="投稿管理" />
        </ListItem>
      </List>
    </React.Fragment>
  );

  const UnauthorizedMenu = (
    <React.Fragment>
      <List>
        <ListItem button component={Link} to="/all-grid">
          <ListItemIcon>
            <IconPhotoLibrary />
          </ListItemIcon>
          <ListItemText primary="写真を見る" />
        </ListItem>
        <ListItem button component={Link} to="/auth">
          <ListItemIcon>
            <IconAddPhoto />
          </ListItemIcon>
          <ListItemText primary="写真を投稿する" />
        </ListItem>
      </List>
    </React.Fragment>
  );

  return (
    <SwipeableDrawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      onOpen={onOpen}
    >
      <div tabIndex={0} role="button" onClick={onClose} onKeyDown={onClose}>
        {isUserAuthorized ? authorizedMenu : UnauthorizedMenu}
      </div>
    </SwipeableDrawer>
  );
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

export default Menu;
