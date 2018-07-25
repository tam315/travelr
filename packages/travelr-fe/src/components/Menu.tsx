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
import IconGrid from '@material-ui/icons/GridOn';
import IconMap from '@material-ui/icons/Place';
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
      <ListItem
        button
        component={Link}
        // @ts-ignore
        to="/post/create"
      >
        <ListItemIcon>
          <IconAddPhoto />
        </ListItemIcon>
        <ListItemText primary="投稿する" />
      </ListItem>

      <ListItem
        button
        component={Link}
        // @ts-ignore
        to="/account"
      >
        <ListItemIcon>
          <IconAccountCircle />
        </ListItemIcon>
        <ListItemText primary="アカウント" />
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
    </React.Fragment>
  );

  const unauthorizedMenu = (
    <React.Fragment>
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
        <List>
          <ListItem>
            <ListItemText
              primary="Travelr"
              primaryTypographyProps={{ variant: 'headline' }}
            />
          </ListItem>
          <Divider />

          <ListItem
            button
            component={Link}
            // @ts-ignore
            to="/all-grid"
          >
            <ListItemIcon>
              <IconGrid />
            </ListItemIcon>
            <ListItemText primary="一覧で見る" />
          </ListItem>

          <ListItem
            button
            component={Link}
            // @ts-ignore
            to="/all-map"
          >
            <ListItemIcon>
              <IconMap />
            </ListItemIcon>
            <ListItemText primary="マップで見る" />
          </ListItem>

          {isUserAuthorized ? authorizedMenu : unauthorizedMenu}

          <Divider />
          <ListItem
            button
            component={Link}
            // @ts-ignore
            to="/about"
          >
            <ListItemText
              primary="このサイトについて"
              primaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        </List>
      </div>
    </SwipeableDrawer>
  );
}

export default Menu;
