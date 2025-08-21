import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/constants.js';

export default class OffersModel extends Observable {
  #waypointsApiService;
  #offers = [];

  constructor({ waypointsApiService }) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  /**
    * @returns {AllOffers[]}
    */
  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#waypointsApiService.offers;
    } catch (err) {
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  getOffersByType(type) {
    const allOffers = this.#offers;
    return allOffers.find((offer) => offer.type === type);
  }

  /**
   * @param {RandomWaypoint.type} type
   * @param {RandomWaypoint.offersId} itemsId
   * @returns {offer[]} offers
  */
  getOffersById(type, itemsId = ['']) {
    const offersType = this.getOffersByType(type);
    return offersType.offers.filter((item) => itemsId.find((id) => item.id === id));
  }
}
