import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDueDate, formatNames } from '../utils/common.js';

function createTripInfoTemplate(dateFrom, dateTo, destinationNames, totalCost) {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title" >${formatNames(destinationNames)}</h1>
        <p class="trip-info__dates">${humanizeDueDate(dateFrom, 'D MMM')} — ${humanizeDueDate(dateTo, 'D MMM')}</p>
      </div>
      <p class="trip-info__cost">
        Total: € <span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`);
}

export default class TripInfo extends AbstractView {
  #dateFrom;
  #dateTo;
  #destinationNames;
  #totalCost;

  constructor({ dateFrom, dateTo, destinationNames, totalCost }) {
    super();
    this.#dateFrom = dateFrom;
    this.#dateTo = dateTo;
    this.#destinationNames = destinationNames;
    this.#totalCost = totalCost;
  }

  get template() {
    return createTripInfoTemplate(this.#dateFrom, this.#dateTo, this.#destinationNames, this.#totalCost);
  }
}
