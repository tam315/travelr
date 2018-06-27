import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import IconDone from '@material-ui/icons/Done';
import IconEdit from '@material-ui/icons/Edit';
import { shallow } from 'enzyme';
import React from 'react';
import { DUMMY_USER_STORE } from '../../config/dummies';
import { PageManageAccount } from '../PageManageAccount';

describe('PageManageAccount component', () => {
  const mock = {
    actions: {
      updateUserInfo: jest.fn(),
      deleteUser: jest.fn((user, callback) => callback()),
    },
    history: { push: jest.fn() },
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <PageManageAccount
        updateUserInfo={mock.actions.updateUserInfo}
        deleteUser={mock.actions.deleteUser}
        history={mock.history}
        user={DUMMY_USER_STORE}
        classes={{}}
      />,
    );
  });

  test('shows not editable displayName first', () => {
    expect(
      wrapper
        .find(Typography)
        .find({ variant: 'subheading' })
        .children()
        .text(),
    ).toBe(DUMMY_USER_STORE.displayName);
  });

  test('shows editable displayName after edit button is clicked', () => {
    wrapper.find(IconEdit).simulate('click');
    expect(wrapper.find(Input).prop('value')).toBe(
      DUMMY_USER_STORE.displayName,
    );
  });

  test('invoke updateUserInfo() after finish edit button is clicked', () => {
    wrapper.find(IconEdit).simulate('click');
    wrapper.find(IconDone).simulate('click');

    expect(mock.actions.updateUserInfo).toBeCalled();
  });

  test('invoke deleteUser() when delete account button is clicked, and navigate to the top page', () => {
    window.confirm = jest.fn().mockImplementation(() => true);
    window.alert = jest.fn();

    fetch.mockResponse();

    wrapper.find({ color: 'secondary' }).simulate('click');

    expect(mock.actions.deleteUser).toBeCalled();
    // navigate to top page
    expect(mock.history.push).toBeCalled();
  });
});
