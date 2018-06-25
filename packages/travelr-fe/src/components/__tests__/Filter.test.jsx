import Button from '@material-ui/core/Button';
import { shallow } from 'enzyme';
import React from 'react';
import { Filter } from '../Filter';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';

describe('Filter component', () => {
  let mockCallback;
  let wrapper;

  beforeEach(() => {
    mockCallback = jest.fn();
    wrapper = shallow(<Filter isOpen onClose={mockCallback} classes={{}} />);
  });

  test('render items', () => {
    const listItemTexts = ['撮影日', 'いいね', 'コメント', '閲覧数'];

    listItemTexts.forEach(text => {
      expect(
        wrapper
          .find(ListItemText)
          .findWhere(node => node.prop('primary') === text)
          .exists(),
      ).toBe(true);
    });

    const textFilelds = [
      '市町村名・建物名',
      '半径',
      'ユーザ名で探す',
      '説明文で探す',
    ];

    textFilelds.forEach(text => {
      expect(
        wrapper
          .find(TextField)
          .findWhere(node => node.prop('placeholder') === text)
          .exists(),
      ).toBe(true);
    });
  });

  test('onClose should be called when the "filter" button pressed', () => {
    wrapper.find(Button).simulate('click');
    expect(mockCallback).toBeCalled();
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('displayName');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('description');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('minDate');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('maxDate');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('lat');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('lng');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('radius');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('minViewCount');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('maxViewCount');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('minLikedCount');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('maxLikedCount');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('minCommentsCount');
    expect(mockCallback.mock.calls[0][0]).toHaveProperty('maxCommentsCount');
  });
});
