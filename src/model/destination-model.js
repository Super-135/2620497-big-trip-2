import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/constants.js';
export default class DestinationModel extends Observable {
  #waypointsApiService;
  #destinations = [];

  constructor({ waypointsApiService }) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  /**
    * @returns {Destination[]}
    */
  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#waypointsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

  getDestinationsById(id) {
    const allDestination = this.#destinations;
    return allDestination.find((item) => item.id === id);
  }
}
