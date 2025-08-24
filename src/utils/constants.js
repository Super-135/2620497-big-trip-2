
const AUTHORIZATION = 'Basic random101string';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const DateFormat = {
  DAY: 'MMM D',
  HOURS_MINUTES: 'HH:mm',
  YEAR: 'DD/MM/YY HH:mm',
  FULL_DATE: 'YYYY-MM-DD',
};

const TextNoEvent = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
};
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};
const Mode = {
  DEFAULT: 'Default',
  EDITING: 'Editing',
};
const SORTING_TYPES = ['day', 'event', 'time', 'price', 'offers'];
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
  ERROR: 'Error',
};
const DEFAULT_TYPE = 'flight';
const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const LoadingMessage = {
  READY: 'Loading...',
  ERROR: 'Failed to load latest route information',
};

export { AUTHORIZATION, END_POINT, DateFormat, TextNoEvent, FilterType, Mode, SORTING_TYPES, SortType, UserAction, UpdateType, DEFAULT_TYPE, TYPES, LoadingMessage };
