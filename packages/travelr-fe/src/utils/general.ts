import { transform, isEqual, isObject } from 'lodash';
import {
  FilterCriterionReduced,
  FilterCriterionFlatten,
} from '../config/types';
import { getPositionFromPlaceName } from './mapsUtils';

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export const difference = (object, base) => {
  const changes = (object, base) =>
    transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  return changes(object, base);
};

export const loadJS = (src: string) => {
  const ref = window.document.getElementsByTagName('script')[0];
  const script = window.document.createElement('script');
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
};

export const flattenCriterion = async (
  criterion: FilterCriterionReduced,
): Promise<FilterCriterionFlatten> => {
  const {
    displayName,
    description,
    shootDate,
    placeName,
    radius,
    viewCount,
    likedCount,
    commentsCount,
  } = criterion;

  const result: FilterCriterionFlatten = {};

  if (displayName) result.displayName = displayName;
  if (description) result.description = description;

  if (shootDate && shootDate.min) result.minDate = shootDate.min;
  if (shootDate && shootDate.max) result.maxDate = shootDate.max;

  if (placeName) {
    const { lng, lat } = await getPositionFromPlaceName(placeName);
    Object.assign(result, { lng, lat });
  }
  if (radius) result.radius = radius;

  if (viewCount && viewCount.min) result.minViewCount = viewCount.min;
  if (viewCount && viewCount.max) result.maxViewCount = viewCount.max;

  if (likedCount && likedCount.min) result.minLikedCount = likedCount.min;
  if (likedCount && likedCount.max) result.maxLikedCount = likedCount.max;

  if (commentsCount && commentsCount.min) {
    result.minCommentsCount = commentsCount.min;
  }
  if (commentsCount && commentsCount.max) {
    result.maxCommentsCount = commentsCount.max;
  }

  return result;
};
