// @flow
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import IconDone from '@material-ui/icons/Done';
import IconEdit from '@material-ui/icons/Edit';
import { shallow } from 'enzyme';
import React from 'react';
import { DUMMY_USER_STORE } from '../../config/dummies';
import { PageManageAccount } from '../PageManageAccount';
import firebaseUtils from '../../utils/firebaseUtils';

jest.mock('../../utils/firebaseUtils');

describe('PageManageAccount component', () => {
  let mock;
  let wrapper;

  beforeEach(() => {
    mock = {
      actions: {
        updateUserInfo: jest.fn(),
        deleteUser: jest.fn((user, callback) => callback()),
        signOutUser: jest.fn(callback => callback()),
      },
      history: { push: jest.fn() },
    };

    wrapper = shallow(
      <PageManageAccount
        updateUserInfo={mock.actions.updateUserInfo}
        signOutUser={mock.actions.signOutUser}
        deleteUser={mock.actions.deleteUser}
        // $FlowIgnore
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

  test('invoke signOutUser() when signout button is clicked, and navigate to the top page', () => {
    fetch.mockResponse();

    wrapper
      .find({ color: 'secondary' })
      .at(0)
      .simulate('click');

    expect(mock.actions.signOutUser).toBeCalled();
    expect(mock.history.push).toBeCalled();
  });

  test('invoke deleteUser() when delete account button is clicked, and navigate to the top page', done => {
    window.confirm = jest.fn().mockImplementation(() => true);
    window.alert = jest.fn();

    fetch.mockResponse();

    wrapper
      .find({ color: 'secondary' })
      .at(1)
      .simulate('click');

    expect(mock.actions.deleteUser).toBeCalled();
    expect(firebaseUtils.deleteUser).toBeCalled();

    setImmediate(() => {
      expect(mock.history.push).toBeCalled();
      done();
    });
  });
});
