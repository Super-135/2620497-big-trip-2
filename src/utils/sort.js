import { SORTING_TYPES } from './constants.js';

function generateSorting(sortType) {
  return SORTING_TYPES.map((value) => ({
    value,
    isSelected: value === sortType,
    isDisabled: value === 'event' || value === 'offers',
  }));
}

export { generateSorting };
