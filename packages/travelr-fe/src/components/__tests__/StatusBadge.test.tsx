import IconComment from '@material-ui/icons/Comment';
import IconView from '@material-ui/icons/Visibility';
import { shallow } from 'enzyme';
import * as React from 'react';
// @ts-ignore
import IconLike from '../../icons/like.svg';
import StatusBadge from '../StatusBadge';

describe('StatusBadge component', () => {
  test('shows count', () => {
    const wrapper = shallow(<StatusBadge icon="like" count={999} />);
    expect(
      wrapper
        .children()
        .children()
        .text(),
    ).toContain('999');
  });

  test('shows like icon (inactive)', () => {
    const wrapper = shallow(<StatusBadge icon="like" count={999} />);
    expect(wrapper.find(IconLike)).toHaveLength(2); // TODO: why 2?
  });

  test('shows like icon (active)', () => {
    const wrapper = shallow(<StatusBadge icon="like" count={999} active />);
    expect(wrapper.find({ fill: '#3F51B5' })).toHaveLength(1);
  });

  test('shows comment icon', () => {
    const wrapper = shallow(<StatusBadge icon="comment" count={999} />);
    expect(wrapper.find(IconComment)).toHaveLength(1);
  });

  test('shows view icon', () => {
    const wrapper = shallow(<StatusBadge icon="view" count={999} />);
    expect(wrapper.find(IconView)).toHaveLength(1);
  });

  test('onClick() prop is called when badge is clicked', () => {
    const mockOnClick = jest.fn();

    const wrapper = shallow(
      <StatusBadge icon="like" count={999} onClick={mockOnClick} />,
    );
    expect(mockOnClick).not.toBeCalled();
    wrapper.simulate('click');
    expect(mockOnClick).toBeCalled();
  });
});
