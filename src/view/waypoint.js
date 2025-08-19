import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDueDate, getDuration } from '../mock/utils.js';
import { DATE_FORMAT } from '../mock/constants.js';

function createStartDateTemplate(start) {
  return (`<time class="event__date" datetime="${humanizeDueDate(start, DATE_FORMAT.fullDate)}">${humanizeDueDate(start, DATE_FORMAT.day)}</time>`);
}

function createTypeEventTemplate(waypoint, destination) {
  const { name } = destination;
  const { type } = waypoint;
  return (`<div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} ${name}</h3>`);
}

function createScheduleTemplate(start, end) {
  return (`<div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="2019-03-18T10:30">${humanizeDueDate(start, DATE_FORMAT.hoursMinutes)}</time>
      &mdash;
      <time class="event__end-time" datetime="2019-03-18T11:00">${humanizeDueDate(end, DATE_FORMAT.hoursMinutes)}</time>
    </p>
    <p class="event__duration">${getDuration(start, end)}</p>
  </div>`);
}

function createPriceTemplate(price) {
  return (`<p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${price}</span>
  </p>`);
}

function createOffersTemplate(offers) {
  return (`<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${offers.map(({ title, price }) => `<li class="event__offer" >
      <span class="event__offer-title">${title}</span>
      +€&nbsp;
      <span class="event__offer-price">${price}</span>
    </li> `).join('')}
  </ul>`);
}

function createFavoriteButton(waypoint) {
  const { isFavorite } = waypoint;
  return (`<button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>`);
}

function createRollupButton() {
  return (`<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`);
}

function createWaypointTemplate(waypoint, offers, destination) {
  const { basePrice, dateFrom, dateTo, } = waypoint;

  return (`
  <li class="trip-events__item">
    <div class="event">
    ${createStartDateTemplate(dateFrom)}
    ${createTypeEventTemplate(waypoint, destination)}
    ${createScheduleTemplate(dateFrom, dateTo)}
    ${createPriceTemplate(basePrice)}
    ${createOffersTemplate(offers)}
    ${createFavoriteButton(waypoint)}
    ${createRollupButton()}
    </div>
  </li>`);
}

export default class Waypoint extends AbstractView {
  #waypoint;
  #offers;
  #destination;
  #handleEditClick;
  #handleFavoriteClick;

  constructor({ waypoint, offers, destination, onEditClick, onFavoriteClick }) {
    super();
    this.#waypoint = waypoint;
    this.#offers = offers;
    this.#destination = destination;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createWaypointTemplate(this.#waypoint, this.#offers, this.#destination);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
