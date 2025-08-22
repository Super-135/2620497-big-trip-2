import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { DateFormat, TYPES } from '../utils/constants.js';
import { humanizeDueDate } from '../utils/common.js';

function createTypeTemplate(waypoint, destination, destinationAll, isDisabled) {
  const { type, id = 1 } = waypoint;
  const { name: namePoint } = destination;
  const cities = destinationAll.map((element) => element.name);
  const pattern = cities.join('|');

  return (`
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>

      <div class="event__type-list">
        <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
          <legend class="visually-hidden">Event type</legend>
          ${TYPES.map((item) => `<div class="event__type-item">
            <input id="event-type-${item}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}" ${item === type ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-${id}">${item}</label>
          </div>`).join('')}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${namePoint}" list="destination-list-${id}" placeholder=" Where will you go?" ${isDisabled ? 'disabled' : ''} pattern="${pattern}" title="Choose from the suggested ones" required>
      <datalist id="destination-list-${id}">
      ${destinationAll.map(({ name: nameDestination }) => `<option value="${nameDestination}"></option>`).join('')}
      </datalist>
    </div>`);
}

function createDateTemplate(waypoint, isDisabled) {
  const { dateFrom, dateTo, id } = waypoint;

  return (`
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizeDueDate(dateFrom, DateFormat.YEAR)}" ${isDisabled ? 'disabled' : ''} required>
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">To</label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanizeDueDate(dateTo, DateFormat.YEAR)}" ${isDisabled ? 'disabled' : ''} required>
    </div>`);
}

function createPriceTemplate(waypoint, isDisabled) {
  const { basePrice, id } = waypoint;
  return (`
    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${id}" type="number" min="1" max="100000" step="1" oninput="if(value.charAt(0) === '0' || value.charAt(0) === '-' || value.includes('.')) value = ''" name="event-price" value="${basePrice}" required ${isDisabled ? 'disabled' : ''}>
    </div>`);
}

function createSaveButton(isDisabled, isSaving) {
  return (`<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>`);
}

function createResetButton(isEditMode, isDeleting) {
  return (`<button class="event__reset-btn" type="reset">${isEditMode ? `${isDeleting ? 'Deleting...' : 'Delete'}` : 'Cancel'}</button>`);
}

function createRollupButton() {
  return (`
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
    `);
}

function createOffersTemplate(offers, offersType, isDisabled) {
  const idPoints = offers.map((item) => item.id);

  if (offersType.offers.length !== 0) {
    return (`
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${offersType.offers.map(({ title: titleOffersType, id: idOfferType, price }) => `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleOffersType.split(' ').at(-1)}-${idOfferType}" type="checkbox" name="event-offer-${titleOffersType.split(' ').at(-1)}" ${idPoints.includes(idOfferType) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
          <label class="event__offer-label" for="event-offer-${titleOffersType.split(' ').at(-1)}-${idOfferType}">
            <span class="event__offer-title">${titleOffersType}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`).join('')}

        </div>
      </section>`
    );
  }
  return '';
}

function createPhotosTemplate(destination) {
  const { pictures } = destination;
  if (pictures?.length === 0) {
    return '';
  }
  return (`
    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures?.map(({ description: descriptionPhoto, src }) => `
      <img class="event__photo" src="${src}" alt="${descriptionPhoto}">`).join('')}
      </div>
    </div>`
  );
}

function createDestinationTemplate(destination) {
  const { description, pictures } = destination;
  if (description?.length === 0 && pictures?.length === 0) {
    return '';
  }
  return (`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${createPhotosTemplate(destination)}
    </section>`);
}

function createFormEditTemplate(state, destinationAll, isEditMode) {
  const { waypoint, offersType, destination, isDisabled, isSaving, isDeleting, offers } = state;
  return (`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post" autocomplete="off">
      <header class="event__header">
        ${createTypeTemplate(waypoint, destination, destinationAll, isDisabled)}
        ${createDateTemplate(waypoint, isDisabled)}
        ${createPriceTemplate(waypoint, isDisabled)}
        ${createSaveButton(isDisabled, isSaving)}
        ${createResetButton(isEditMode, isDeleting)}
        ${createRollupButton()}
      </header>
      <section class="event__details">
        ${createOffersTemplate(offers, offersType, isDisabled)}
        ${createDestinationTemplate(destination)}
      </section>
    </form>
  </li>`);
}

export default class FormEdit extends AbstractStatefulView {
  #destinationAll;
  #offersAll;
  #handleFormSubmit;
  #datepickerStart;
  #datepickerEnd;
  #handleDeleteClick;
  #isEditMode;

  constructor({ waypoint, offers, destination, offersType, destinationAll, offersAll, onFormSubmit, onDeleteClick, isEditMode }) {
    super();
    this._setState(FormEdit.addsValuesPointToState(waypoint, offersType, destination, offers));
    this.#destinationAll = destinationAll;
    this.#offersAll = offersAll;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#isEditMode = isEditMode;

    this._restoreHandlers();
  }

  get template() {
    return createFormEditTemplate(this._state, this.#destinationAll, this.#isEditMode, this.#offersAll);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  reset(waypoint, offersType, destination, offers) {
    this.updateElement(
      FormEdit.addsValuesPointToState(waypoint, offersType, destination, offers)
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')?.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
    this.element.querySelector('.event__save-btn').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeInputChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#eventDestinationInputHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#waypointDeleteClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersCheckboxChangeHandler);

    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
    }));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const { dateFrom, dateTo } = this._state.waypoint;
    if (dateFrom && dateTo) {
      this.#handleFormSubmit(FormEdit.retrievesValuesStateToPoint(this._state.waypoint));
    }
  };

  #eventTypeInputChangeHandler = (evt) => {
    this.updateElement({
      waypoint: {
        ...this._state.waypoint,
        type: evt.target.value,
        offersId: [],
      },
      offersType: this.#offersAll.find((offer) => offer.type === evt.target.value),
      offers: [],
    });
  };

  #offersCheckboxChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.id.replace(`${evt.target.name}-`, '');
    const isChecked = evt.target.checked;

    const newOffers = new Set(this._state.waypoint.offersId);

    if (isChecked) {
      evt.target.setAttribute('checked', '');
      newOffers.add(offerId);
    } else {
      evt.target.removeAttribute('checked');
      newOffers.delete(offerId);
    }

    this._setState({
      waypoint: {
        ...this._state.waypoint,
        offersId: Array.from(newOffers),
      },
      offers: this._state.offersType.offers.filter((item) => Array.from(newOffers).find((id) => item.id === id)),
    });
  };

  #eventDestinationInputHandler = (evt) => {
    if (evt.target.value === '') {
      return;
    }

    const selectedDestination = this.#destinationAll.find((destination) => destination.name === evt.target.value);
    if (selectedDestination) {
      this.updateElement({
        waypoint: {
          ...this._state.waypoint,
          destination: selectedDestination.id,
        },
        destination: selectedDestination,
      });
    }
  };

  #priceInputChangeHandler = (evt) => {
    this._setState({
      waypoint: {
        ...this._state.waypoint,
        basePrice: evt.target.value,
      },
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      waypoint: {
        ...this._state.waypoint,
        dateFrom: userDate.toISOString(),
      },
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    if (userDate.toISOString() >= this._state.waypoint.dateFrom) {
      this._setState({
        waypoint: {
          ...this._state.waypoint,
          dateTo: userDate.toISOString(),
        },
      });
    }
  };

  #setDatepickerStart() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.waypoint.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
  }

  #setDatepickerEnd() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.waypoint.dateTo,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.waypoint.dateFrom,
      },
    );
  }

  #waypointDeleteClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.setAttribute('disabled', true);
    this.#handleDeleteClick(FormEdit.retrievesValuesStateToPoint(this._state.waypoint));
  };

  static addsValuesPointToState(waypoint, offersType, destination, offers) {
    return {
      waypoint: {
        ...waypoint,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
      offersType: { ...offersType },
      destination: { ...destination },
      offers: [...offers],
    };
  }

  static retrievesValuesStateToPoint(state) {
    const states = { ...state };
    delete states.isDisabled;
    delete states.isSaving;
    delete states.isDeleting;
    return states;
  }
}
