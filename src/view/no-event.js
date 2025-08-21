import AbstractView from '../framework/view/abstract-view.js';
import { TextNoEvent } from '../utils/constants.js';

function createNoEventTemplate(filterType) {
  const noEventTextValue = TextNoEvent[filterType.toUpperCase()];

  return (`<p class="trip-events__msg">${noEventTextValue}</p>`);
}

export default class NoEvent extends AbstractView {
  #filterType;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoEventTemplate(this.#filterType);
  }
}
