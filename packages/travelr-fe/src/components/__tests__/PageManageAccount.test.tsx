import Input from '@material-ui/core/Input';
import IconDone from '@material-ui/icons/Done';
import IconEdit from '@material-ui/icons/Edit';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DUMMY_USER_STORE } from '../../config/dummies';
import { PageManageAccount } from '../PageManageAccount';

declare const fetch: any;

jest.mock('../../utils/firebaseUtils');

describe('PageManageAccount component', () => {
  let mock;
  let wrapper;

  beforeEach(() => {
    jest.resetAllMocks();
    mock = {
      actions: {
        updateUserInfo: jest.fn(),
        signOutUser: jest.fn(),
        deleteUser: jest.fn(),
        addSnackbarQueue: jest.fn(),
        sendEmailVerification: jest.fn(),
      },
    };

    wrapper = shallow(
      <PageManageAccount
        updateUserInfo={mock.actions.updateUserInfo}
        signOutUser={mock.actions.signOutUser}
        deleteUser={mock.actions.deleteUser}
        sendEmailVerification={mock.actions.sendEmailVerification}
        // $FlowIgnore
        user={DUMMY_USER_STORE}
        classes={{}}
      />,
    );
  });

  test('shows not editable displayName first', () => {
    expect(
      wrapper
        .find({ dataenzyme: 'displayName' })
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

  test('shows emailVerified status', () => {
    expect(
      wrapper
        .find({ dataenzyme: 'emailVerified' })
        .children()
        .at(1)
        .text(),
    ).toBe('認証済み');

    wrapper.setProps({ user: { ...DUMMY_USER_STORE, emailVerified: false } });

    expect(
      wrapper
        .find({ dataenzyme: 'emailVerified' })
        .children()
        .at(1)
        .text(),
    ).toBe('未認証（画像の投稿ができません）');
  });

  test('send verification email', () => {
    wrapper.setProps({ user: { ...DUMMY_USER_STORE, emailVerified: false } });
    wrapper.find({ dataenzyme: 'sendEmailVerification' }).simulate('click');

    expect(mock.actions.sendEmailVerification).toBeCalled();
  });

  test('invoke updateUserInfo() after finish edit button is clicked', () => {
    wrapper.find(IconEdit).simulate('click');
    wrapper.find(IconDone).simulate('click');

    expect(mock.actions.updateUserInfo).toBeCalled();
  });

  test('invoke signOutUser() when signout button is clicked', () => {
    fetch.mockResponse();

    wrapper
      .find({ color: 'secondary' })
      .at(0)
      .simulate('click');

    expect(mock.actions.signOutUser).toBeCalled();
  });

  test('invoke deleteUser() when delete account button is clicked', done => {
    wrapper
      .find({ color: 'secondary' })
      .at(1)
      .simulate('click');

    setImmediate(() => {
      expect(mock.actions.deleteUser).toBeCalled();
      done();
    });
  });
});
