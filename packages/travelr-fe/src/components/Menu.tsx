import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@material-ui/core';
import IconAccountCircle from '@material-ui/icons/AccountCircle';
import IconAddPhoto from '@material-ui/icons/AddAPhoto';
import IconPhotoLibrary from '@material-ui/icons/PhotoLibrary';
import IconViewList from '@material-ui/icons/ViewList';
import * as React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  isOpen: boolean;
  isUserAuthorized: boolean;
  onClose: any;
  onOpen: any;
};

function Menu(props: Props) {
  const { isOpen, isUserAuthorized, onClose, onOpen } = props;

  const authorizedMenu = (
    <React.Fragment>
      <List>
        {/* TODO: add account information here */}
        <ListItem
          button
          component={Link}
          // @ts-ignore
          to="/all-grid"
        >
          <ListItemIcon>
            <IconPhotoLibrary />
          </ListItemIcon>
          <ListItemText primary="写真を見る" />
        </ListItem>
        <ListItem
          button
          component={Link}
          // @ts-ignore
          to="/post/create"
        >
          <ListItemIcon>
            <IconAddPhoto />
          </ListItemIcon>
          <ListItemText primary="写真を投稿する" />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem
          button
          component={Link}
          // @ts-ignore
          to="/account"
        >
          <ListItemIcon>
            <IconAccountCircle />
          </ListItemIcon>
          <ListItemText primary="アカウント管理" />
        </ListItem>
        <ListItem
          button
          component={Link}
          // @ts-ignore
          to="/account/posts"
        >
          <ListItemIcon>
            <IconViewList />
          </ListItemIcon>
          <ListItemText primary="投稿管理" />
        </ListItem>
      </List>
    </React.Fragment>
  );

  const unauthorizedMenu = (
    <React.Fragment>
      <List>
        {/* @ts-ignore */}
        <ListItem
          button
          component={Link}
          // @ts-ignore
          to="/all-grid"
        >
          <ListItemIcon>
            <IconPhotoLibrary />
          </ListItemIcon>
          <ListItemText primary="写真を見る" />
        </ListItem>
        <ListItem
          button
          component={Link}
          // @ts-ignore
          to="/auth"
        >
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
        {isUserAuthorized ? authorizedMenu : unauthorizedMenu}
      </div>
    </SwipeableDrawer>
  );
}

export default Menu;
