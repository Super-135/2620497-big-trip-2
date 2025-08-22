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
  DEFAULT: 'Default',
  EDITING: 'Editing',
};
const SORTING = ['day', 'event', 'time', 'price', 'offers'];
const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};
const UserAction = {
  UPDATE_WAYPOINT: 'UpdateWaypoint',
  ADD_WAYPOINT: 'AddWaypoint',
  DELETE_WAYPOINT: 'DeleteWaypoint',
};
const UpdateType = {
  PATCH: 'Patch',
  MINOR: 'Minor',
  MAJOR: 'Major',
  INIT: 'Init',
};
const DEFAULT_TYPE = 'flight';
const TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export { DateFormat, CLASS_NAME, TextNoEvent, FilterType, Mode, SORTING, SortType, UserAction, UpdateType, DEFAULT_TYPE, TYPE };
