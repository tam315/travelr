import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DUMMY_FILTER_CRITERION } from '../../config/dummies';
import { INITIAL_STATE as filterInitialState } from '../../reducers/filterReducer';
import { Filter } from '../Filter';

jest.mock('react-input-range');

describe('Filter component', () => {
  let mock;
  let wrapper;

  beforeEach(() => {
    jest.resetAllMocks();
    mock = {
      onClose: jest.fn(),
      onFilter: jest.fn(),
      onClearFilter: jest.fn(),
    };
    wrapper = shallow(
      <Filter
        isOpen
        onClose={mock.onClose}
        onFilter={mock.onFilter}
        onClearFilter={mock.onClearFilter}
        classes={{}}
        filter={filterInitialState}
      />,
    );
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

  test('onFilter should be called when the "filter" button pressed', () => {
    wrapper.setState({
      criterion: DUMMY_FILTER_CRITERION,
    });
    wrapper.find(Button).simulate('click');

    expect(mock.onFilter).toBeCalledWith(
      DUMMY_FILTER_CRITERION,
      filterInitialState.criterionUntouched,
    );
  });

  test('onClearFilter should be called when the "clear filter" button pressed', () => {
    wrapper.find({ dataenzyme: 'clear-filter' }).simulate('click');

    expect(mock.onClearFilter).toBeCalled();
  });

  test('update component criterion when user filtered posts or cleared filter', () => {
    wrapper.setProps({
      filter: {
        criterion: DUMMY_FILTER_CRITERION, // <= from initial state to this
        criterionUntouched: filterInitialState.criterionUntouched,
        rangeSetupDone: filterInitialState.rangeSetupDone,
      },
    });

    expect(wrapper.state('criterion')).toEqual(DUMMY_FILTER_CRITERION);
  });

  test('update component criterion when GET_FILTER_SELECTOR_RANGE_SUCCESS', () => {
    wrapper.setProps({
      filter: {
        criterion: filterInitialState.criterion,
        criterionUntouched: DUMMY_FILTER_CRITERION, // <= from initial state to this
        rangeSetupDone: filterInitialState.rangeSetupDone,
      },
    });

    expect(wrapper.state('criterion')).toEqual(DUMMY_FILTER_CRITERION);
  });

  test('criterion of component is reset if user just closed the filter', () => {
    // simulate user input
    wrapper.setState({
      criterion: DUMMY_FILTER_CRITERION,
    });

    expect(wrapper.state('criterion')).toEqual(DUMMY_FILTER_CRITERION);
    wrapper.instance().handleClose();
    expect(wrapper.state('criterion')).toEqual(
      filterInitialState.criterionUntouched,
    );
  });

  test("only accepsts numbers for 'radius'", () => {
    // simulate user input
    wrapper.find({ dataenzyme: 'radius' }).simulate('change', {
      target: { value: 'ABCあいう５０' },
    });

    expect(wrapper.state('criterion').radius).toEqual('50');
  });
});
