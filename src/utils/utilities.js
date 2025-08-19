import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration.js';
dayjs.extend(durationPlugin);
import { FilterType } from './constants.js';
const humanizeDueDate = (dueDate, format) => dueDate ? dayjs(dueDate).format(format) : '';

const getDuration = (start, end) => {
  const duration = dayjs.duration(dayjs(end).diff(dayjs(start)));
  if (duration.days()) {
    return duration.format('DD[d] HH[h] mm[m]');
  }
  if (duration.hours()) {
    return duration.format('HH[h] mm[m]');
  }

  return duration.format('mm[m]');
};

function checksTravelIsSame(dueDate) {
  return dueDate && dayjs(dueDate).isSame(dayjs(), 'D');
}

function checksTravelIsBefore(dueDate) {
  return dueDate && dayjs(dueDate).isBefore(dayjs(), 'D');
}

function checksTravelIsAfter(dueDate) {
  return dueDate && dayjs(dueDate).isAfter(dayjs(), 'D');
}

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => checksTravelIsBefore(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => checksTravelIsSame(point.dateFrom)),
  [FilterType.FUTURE]: (points) => points.filter((point) => checksTravelIsAfter(point.dateFrom)),
};

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function sortWaypointByDate(waypointA, waypointB) {
  if (waypointA.dateFrom > waypointB.dateFrom) {
    return 1;
  }
  if (waypointA.dateFrom < waypointB.dateFrom) {
    return -1;
  }
  return 0;
}

function sortWaypointByDuration(waypointA, waypointB) {

  const getDurationBySort = (start, end) => dayjs.duration(dayjs(end).diff(dayjs(start)));

  if (getDurationBySort(waypointA.dateFrom, waypointA.dateTo) < getDurationBySort(waypointB.dateFrom, waypointB.dateTo)) {
    return 1;
  }
  if (getDurationBySort(waypointA.dateFrom, waypointA.dateTo) > getDurationBySort(waypointB.dateFrom, waypointB.dateTo)) {
    return -1;
  }
  return 0;
}

function sortWaypointByPrice(waypointA, waypointB) {
  if (Number(waypointA.basePrice) < Number(waypointB.basePrice)) {
    return 1;
  }
  if (Number(waypointA.basePrice) > Number(waypointB.basePrice)) {
    return -1;
  }
  return 0;
}

export { humanizeDueDate, getDuration, filter, updateItem, sortWaypointByDate, sortWaypointByDuration, sortWaypointByPrice };
