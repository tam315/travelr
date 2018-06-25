import IconComment from '@material-ui/icons/Comment';
import IconView from '@material-ui/icons/Visibility';
import { shallow } from 'enzyme';
import React from 'react';
import IconLike from '../../icons/like.svg';
import StatusBadge from '../StatusBadge';

describe('StatusBadge component', () => {
  test('shows count', () => {
    const wrapper = shallow(<StatusBadge icon="like" count={999} />);
    expect(wrapper.html()).toContain('999');
  });

  test('shows like icon', () => {
    const wrapper = shallow(<StatusBadge icon="like" count={999} />);
    expect(wrapper.find(IconLike)).toHaveLength(2); // TODO: why 2?
  });

  test('shows comment icon', () => {
    const wrapper = shallow(<StatusBadge icon="comment" count={999} />);
    expect(wrapper.find(IconComment)).toHaveLength(1);
  });

  test('shows view icon', () => {
    const wrapper = shallow(<StatusBadge icon="view" count={999} />);
    expect(wrapper.find(IconView)).toHaveLength(1);
  });
});
