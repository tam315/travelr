import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DUMMY_FILTER_CRITERION, DUMMY_APP_STORE } from '../../config/dummies';
import { INITIAL_STATE as filterInitialState } from '../../reducers/filterReducer';
import DialogService from '../DialogService';

describe('DialogService component', () => {
  let mock;
  let wrapper;
  const app = {
    ...DUMMY_APP_STORE,
    dialogIsOpen: true,
    dialogTitle: 'dummy_dialogTitle',
    dialogContent: 'dummy_dialogContent',
    dialogNegativeSelector: 'dummy_dialogNegativeSelector',
    dialogPositiveSelector: 'dummy_dialogPositiveSelector',
    dialogSuccessCallback: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mock = {
      closeDialog: jest.fn(),
    };

    wrapper = shallow(
      <DialogService app={app} closeDialog={mock.closeDialog} />,
    );
  });

  test('show dialog', () => {
    expect(wrapper.debug()).toContain(app.dialogTitle);
    expect(wrapper.debug()).toContain(app.dialogContent);
    expect(wrapper.debug()).toContain(app.dialogNegativeSelector);
    expect(wrapper.debug()).toContain(app.dialogPositiveSelector);
  });

  test('callback is called when positive selection clicked', () => {
    wrapper.find({ dataenzyme: 'positive-button' }).simulate('click');
    expect(app.dialogSuccessCallback).toBeCalled();
  });

  test('just close dialog if negative selection clicked', () => {
    wrapper.find({ dataenzyme: 'negative-button' }).simulate('click');
    expect(app.dialogSuccessCallback).not.toBeCalled();
    expect(mock.closeDialog).toBeCalled();
  });
});
