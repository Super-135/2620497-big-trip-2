import { getRandomWaypoint, mockDestination, mockOptions } from '../mock/waypoints.js';

const WAYPOINT_COUNT = 7;

export default class WaypointModel {
  /**
    * @type {RandomWaypoint[]}
    */
  #waypoints = Array.from({ length: WAYPOINT_COUNT }, getRandomWaypoint);

  /**
    * @type {AllOffers[]}
    */
  #offers = mockOptions;

  /**
     * @type {Destination[]}
     */
  #destination = mockDestination;

  /**
    * @returns {RandomWaypoint[]}
    */

  get waypoints() {
    return structuredClone(this.#waypoints);
  }

  /**
    * @returns {AllOffers[]}
    */
  get offers() {
    return structuredClone(this.#offers);
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
  getOffersById(type, itemsId) {
    const offersType = this.getOffersByType(type);
    return offersType.offers.filter((item) => itemsId.find((id) => item.id === id));
  }

  /**
    * @returns {Destination[]}
    */
  get destinations() {
    return structuredClone(this.#destination);
  }

  /**
   * @param {RandomWaypoint.destination} id
   * @returns {Destination[]} destinations
  */
  getDestinationsById(id) {
    const allDestination = this.destinations;
    return allDestination.find((item) => item.id === id);
  }
}
