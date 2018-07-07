// @flow
import { PageAuth } from '../PageAuth';
import { shallow } from 'enzyme';
import React from 'react';
import { Button, TextField } from '@material-ui/core';
import firebaseUtils from '../../utils/firebaseUtils';

jest.mock('../../utils/firebaseUtils');

describe('', () => {
  let mock;

  beforeEach(() => {
    mock = {
      actions: {
        getOrCreateUserInfo: jest.fn(),
      },
      signInWithRedirect: jest.fn(),
    };
  });

  test('displays 3 buttons(google, facebok, mail-address-auth)', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
      />,
    );
    expect(wrapper.find(Button)).toHaveLength(3);
  });

  test('displays 2 TextField for mail and password', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
      />,
    );
    expect(wrapper.find(TextField)).toHaveLength(2);
  });

  test('signInWithRedirect is called when a google button is clicked', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
      />,
    );

    wrapper
      .find(Button)
      .at(0)
      .simulate('click');

    expect(firebaseUtils.signInWithGoogle).toBeCalled();
  });

  test('signInWithRedirect is called when a facebook button is clicked', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        getOrCreateUserInfo={mock.actions.getOrCreateUserInfo}
      />,
    );

    wrapper
      .find(Button)
      .at(1)
      .simulate('click');

    expect(firebaseUtils.signInWithFacebook).toBeCalled();
  });
});
