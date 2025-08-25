import AbstractView from '../framework/view/abstract-view.js';
import { LoadingMessage } from '../utils/constants.js';

function createLoadingTemplate(isError) {
  return (`<p class="trip-events__msg">${isError ? LoadingMessage.ERROR : LoadingMessage.READY}</p>`);
}

export default class LoadingView extends AbstractView {
  #isError;

  constructor({ isError }) {
    super();
    this.#isError = isError;
  }

  get template() {
    return createLoadingTemplate(this.#isError);
  }
}
