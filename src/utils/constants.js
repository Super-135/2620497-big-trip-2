const DateFormat = {
  DAY: 'MMM D',
  HOURS_MINUTES: 'HH:mm',
  YEAR: 'DD/MM/YY HH:mm',
  FULL_DATE: 'YYYY-MM-DD',
};
const CLASS_NAME = {
  'Add luggage': 'luggage',
  'Switch to comfort class': 'comfort',
  'Add meal': 'meal',
  'Choose seats': 'seats',
  'Travel by train': 'train',
  'Order Uber': 'uber',
};
const TextNoEvent = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
};
const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SORTING = ['day', 'event', 'time', 'price', 'offers'];
const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export { DateFormat, CLASS_NAME, TextNoEvent, FilterType, Mode, SORTING, SortType };
