import deepmerge from 'deepmerge';
import actionTypes from '../actions/types';
import { FilterCriterion, FilterStore } from '../config/types';

const INITIAL_STATE_CRITERION_UNTOUCHED: FilterCriterion = {
  shootDate: {
    min: 1900,
    max: 2018,
  },
  likedCount: {
    min: 0,
    max: 1,
  },
  commentsCount: {
    min: 0,
    max: 1,
  },
  viewCount: {
    min: 0,
    max: 1,
  },
  placeName: '',
  radius: '',
  displayName: '',
  description: '',
};

export const INITIAL_STATE: FilterStore = {
  // maximum value of 'likedCount', 'commentsCount' and 'viewCount'
  // will be overwritten when GET_FILTER_SELECTOR_RANGE_SUCCESS
  criterion: {},
  criterionUntouched: INITIAL_STATE_CRITERION_UNTOUCHED,
  rangeSetupDone: false,
};

const filterReducer = (
  state: FilterStore = INITIAL_STATE,
  action: any,
): FilterStore => {
  switch (action.type) {
    case actionTypes.CHANGE_FILTER_CRITERION_SUCCESS:
      return {
        ...state,
        criterion: action.payload,
      };
    case actionTypes.GET_FILTER_SELECTOR_RANGE_SUCCESS:
      if (state.rangeSetupDone) return state;

      const { maxViewCount, maxLikedCount, maxCommentsCount } = action.payload;

      const diff = {
        likedCount: {
          max: maxLikedCount,
        },
        commentsCount: {
          max: maxCommentsCount,
        },
        viewCount: {
          max: maxViewCount,
        },
      };

      return {
        ...state,
        criterionUntouched: deepmerge(state.criterionUntouched, diff),
        rangeSetupDone: true,
      };
    default:
      return state;
  }
};

export default filterReducer;
