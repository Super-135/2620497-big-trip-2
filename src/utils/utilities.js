import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration.js';
dayjs.extend(durationPlugin);
import { FilterType } from './constants.js';
const humanizeDueDate = (dueDate, format) => dueDate ? dayjs(dueDate).format(format) : '';

const HOURS_COUNT = 24;
const MINUTES_COUNT = 60;

const getDuration = (start, end) => {
  const duration = dayjs.duration(dayjs(end).diff(dayjs(start)));
  if (duration.months()) {
    const totalDays = duration.asDays();
    const days = Math.floor(totalDays);
    const hours = Math.floor((totalDays - days) * HOURS_COUNT);
    const minutes = Math.floor(duration.asMinutes() - days * HOURS_COUNT * MINUTES_COUNT - hours * MINUTES_COUNT);
    return `${days}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }
  if (duration.days()) {
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes() - hours * MINUTES_COUNT);
    return `${duration.days()}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }
  if (duration.hours()) {
    return `${duration.hours().toString().padStart(2, '0')}H ${duration.minutes().toString().padStart(2, '0')}M`;
  }

  return `${duration.minutes().toString().padStart(2, '0')}M`;
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

export { humanizeDueDate, getDuration, filter, sortWaypointByDate, sortWaypointByDuration, sortWaypointByPrice };
