import ListItem from '@material-ui/core/ListItem';
import { mount } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Menu from '../Menu';

describe('Menu component', () => {
  describe('if user is signed out', () => {
    let wrapper;

    beforeAll(() => {
      const mockFunction = jest.fn();
      wrapper = mount(
        <BrowserRouter>
          <Menu
            isOpen
            onClose={mockFunction}
            onOpen={mockFunction}
            isUserAuthorized={false}
          />
        </BrowserRouter>,
      );
    });

    test('have correct menu items', () => {
      const menuItems = [
        ['写真を見る', '/all-grid'],
        ['写真を投稿する', '/auth'],
      ];

      menuItems.forEach((item, index) => {
        const [name, link] = item;

        expect(
          wrapper
            .find(ListItem)
            .at(index)
            .text(),
        ).toContain(name);
        expect(
          wrapper
            .find(ListItem)
            .at(index)
            .props().to,
        ).toBe(link);
      });
    });
  });

  describe('if user is signed in', () => {
    let wrapper;

    beforeAll(() => {
      const mockFunction = jest.fn();

      wrapper = mount(
        <BrowserRouter>
          <Menu
            isOpen
            isUserAuthorized
            onClose={mockFunction}
            onOpen={mockFunction}
          />
        </BrowserRouter>,
      );
    });

    test('have correct menu items', () => {
      const menuItems = [
        ['写真を見る', '/all-grid'],
        ['写真を投稿する', '/post/create'],
        ['アカウント管理', '/account'],
        ['投稿管理', '/account/posts'],
      ];

      menuItems.forEach((item, index) => {
        const [name, link] = item;

        expect(
          wrapper
            .find(ListItem)
            .at(index)
            .text(),
        ).toContain(name);
        expect(
          wrapper
            .find(ListItem)
            .at(index)
            .props().to,
        ).toBe(link);
      });
    });
  });
});
