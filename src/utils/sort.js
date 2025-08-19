import { SORTING } from './constants.js';

function generateSorting(sortType) {
  return SORTING.map((value) => ({
    value,
    isSelected: value === sortType,
    isDisabled: value === 'event' || value === 'offers',
  }));
}

export { generateSorting };
