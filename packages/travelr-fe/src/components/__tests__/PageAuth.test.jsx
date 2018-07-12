// @flow
import { PageAuth } from '../PageAuth';
import { shallow } from 'enzyme';
import React from 'react';
import { Button, Typography } from '@material-ui/core';

jest.mock('../../utils/firebaseUtils');

describe('', () => {
  let mock;

  beforeEach(() => {
    mock = {
      actions: {
        signInWithGoogle: jest.fn(),
        signInWithFacebook: jest.fn(),
        signInWithEmail: jest.fn(),
        signUpWithEmail: jest.fn(),
      },
      signInWithRedirect: jest.fn(),
    };
  });

  test('signInWithRedirect is called when a google button is clicked', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        signInWithGoogle={mock.actions.signInWithGoogle}
        signInWithFacebook={mock.actions.signInWithFacebook}
        signInWithEmail={mock.actions.signInWithEmail}
        signUpWithEmail={mock.actions.signUpWithEmail}
      />,
    );

    wrapper
      .find(Button)
      .at(0)
      .simulate('click');

    expect(mock.actions.signInWithGoogle).toBeCalled();
  });

  test('signInWithRedirect is called when a facebook button is clicked', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        signInWithGoogle={mock.actions.signInWithGoogle}
        signInWithFacebook={mock.actions.signInWithFacebook}
        signInWithEmail={mock.actions.signInWithEmail}
        signUpWithEmail={mock.actions.signUpWithEmail}
      />,
    );

    wrapper
      .find(Button)
      .at(1)
      .simulate('click');

    expect(mock.actions.signInWithFacebook).toBeCalled();
  });

  test('signUpWithEmail is called when a button is clicked', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        signInWithGoogle={mock.actions.signInWithGoogle}
        signInWithFacebook={mock.actions.signInWithFacebook}
        signInWithEmail={mock.actions.signInWithEmail}
        signUpWithEmail={mock.actions.signUpWithEmail}
      />,
    );

    wrapper
      .find(Button)
      .at(2)
      .simulate('click');

    expect(mock.actions.signUpWithEmail).toBeCalled();
  });

  test('signInWithEmail is called when a button is clicked', () => {
    const wrapper = shallow(
      <PageAuth
        classes={{}}
        signInWithGoogle={mock.actions.signInWithGoogle}
        signInWithFacebook={mock.actions.signInWithFacebook}
        signInWithEmail={mock.actions.signInWithEmail}
        signUpWithEmail={mock.actions.signUpWithEmail}
      />,
    );

    wrapper
      .find(Typography)
      .last()
      .simulate('click');

    wrapper
      .find(Button)
      .last()
      .simulate('click');

    expect(mock.actions.signInWithEmail).toBeCalled();
  });
});
