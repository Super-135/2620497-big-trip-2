import Observable from '../framework/observable.js';
import { mockOptions } from '../mock/waypoints.js';

export default class OffersModel extends Observable {

  /**
    * @type {AllOffers[]}
    */
  #offers = mockOptions;

  /**
    * @returns {AllOffers[]}
    */
  get offers() {
    return this.#offers;
  }

  /**
   * @param {RandomWaypoint.type} type
   * @returns {offer[]} offers
  */
  getOffersByType(type) {
    const allOffers = this.offers;
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
