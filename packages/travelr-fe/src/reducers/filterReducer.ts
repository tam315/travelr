import actionTypes from '../actions/types';
import { FilterCriterion, FilterStore } from '../config/types';

const CRITERION_INITIAL_STATE: FilterCriterion = {
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
  criterion: CRITERION_INITIAL_STATE,
  criterionUntouched: CRITERION_INITIAL_STATE,
  rangeSetupDone: false,
};

const filterReducer = (
  state: FilterStore = INITIAL_STATE,
  action: any,
): FilterStore => {
  switch (action.type) {
    case actionTypes.CHANGE_FILTER_CRITERION_SUCCESS:
      const newCriterion = action.payload.criterion;
      return {
        ...state,
        criterion: newCriterion,
      };
    case actionTypes.GET_FILTER_SELECTOR_RANGE_SUCCESS:
      if (state.rangeSetupDone) return state;

      const { maxViewCount, maxLikedCount, maxCommentsCount } = action.payload;

      const diff = {
        likedCount: {
          min: 0,
          max: maxLikedCount,
        },
        commentsCount: {
          min: 0,
          max: maxCommentsCount,
        },
        viewCount: {
          min: 0,
          max: maxViewCount,
        },
      };

      return {
        criterion: {
          ...state.criterion,
          ...diff,
        },
        criterionUntouched: {
          ...state.criterionUntouched,
          ...diff,
        },
        rangeSetupDone: true,
      };
    default:
      return state;
  }
};

export default filterReducer;
