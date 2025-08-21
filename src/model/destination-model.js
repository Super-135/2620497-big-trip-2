import Observable from '../framework/observable.js';
import { mockDestination } from '../mock/waypoints.js';

export default class DestinationModel extends Observable {

  /**
     * @type {Destination[]}
     */
  #destination = mockDestination;

  /**
    * @returns {Destination[]}
    */
  get destinations() {
    return this.#destination;
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
