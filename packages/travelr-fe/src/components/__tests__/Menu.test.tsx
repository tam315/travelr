import { ListItemText, ListItem } from '@material-ui/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import Menu from '../Menu';

describe('Menu component', () => {
  let wrapper;

  beforeAll(() => {
    const mockFunction = jest.fn();
    wrapper = shallow(
      <Menu
        isOpen
        onClose={mockFunction}
        onOpen={mockFunction}
        isUserAuthorized={false}
      />,
    );
  });

  test('if user is NOT authorized', () => {
    const menuItems = [
      ['Travelr'],
      ['一覧で見る', '/all-grid'],
      ['マップで見る', '/all-map'],
      ['写真を投稿する', '/auth'],
      ['このサイトについて', '/about'],
    ];

    menuItems.forEach((item, index) => {
      const [name, link] = item;

      expect(
        wrapper
          .find(ListItemText)
          .at(index)
          .prop('primary'),
      ).toBe(name);

      if (link) {
        expect(
          wrapper
            .find(ListItem)
            .at(index)
            .prop('to'),
        ).toBe(link);
      }
    });
  });

  test('if user IS authorized', () => {
    const menuItems = [
      ['Travelr'],
      ['一覧で見る', '/all-grid'],
      ['マップで見る', '/all-map'],
      ['投稿する', '/post/create'],
      ['アカウント', '/account'],
      ['投稿管理', '/account/posts'],
      ['このサイトについて', '/about'],
    ];

    wrapper.setProps({ isUserAuthorized: true });

    menuItems.forEach((item, index) => {
      const [name, link] = item;

      expect(
        wrapper
          .find(ListItemText)
          .at(index)
          .prop('primary'),
      ).toBe(name);

      if (link) {
        expect(
          wrapper
            .find(ListItem)
            .at(index)
            .prop('to'),
        ).toBe(link);
      }
    });
  });
});
