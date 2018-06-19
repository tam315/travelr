import React from 'react';
import { mount } from 'enzyme';
import Menu from '../Menu';
import { BrowserRouter } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';

describe('Header component', () => {
  describe('if user is signed out', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <BrowserRouter>
          <Menu isOpen={true} onClose={null} isUserAuthorized={false} />
        </BrowserRouter>,
      );
    });

    test('have correct menu items', () => {
      expect(
        wrapper
          .find(ListItem)
          .at(0)
          .text(),
      ).toContain('写真を見る');
      expect(
        wrapper
          .find(ListItem)
          .at(0)
          .props().to,
      ).toBe('/all-grid');
      expect(
        wrapper
          .find(ListItem)
          .at(1)
          .text(),
      ).toContain('写真を投稿する');
      expect(
        wrapper
          .find(ListItem)
          .at(1)
          .props().to,
      ).toBe('/auth');
    });
  });

  describe('if user is signed in', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <BrowserRouter>
          <Menu isOpen={true} onClose={null} isUserAuthorized={true} />
        </BrowserRouter>,
      );
    });

    test('have correct menu items', () => {
      expect(
        wrapper
          .find(ListItem)
          .at(0)
          .text(),
      ).toContain('写真を見る');
      expect(
        wrapper
          .find(ListItem)
          .at(0)
          .props().to,
      ).toBe('/all-grid');
      expect(
        wrapper
          .find(ListItem)
          .at(1)
          .text(),
      ).toContain('写真を投稿する');
      expect(
        wrapper
          .find(ListItem)
          .at(1)
          .props().to,
      ).toBe('/post/create');
      expect(
        wrapper
          .find(ListItem)
          .at(2)
          .text(),
      ).toContain('アカウント管理');
      expect(
        wrapper
          .find(ListItem)
          .at(2)
          .props().to,
      ).toBe('/account');
      expect(
        wrapper
          .find(ListItem)
          .at(3)
          .text(),
      ).toContain('投稿管理');
      expect(
        wrapper
          .find(ListItem)
          .at(3)
          .props().to,
      ).toBe('/account/posts');
    });
  });
});
