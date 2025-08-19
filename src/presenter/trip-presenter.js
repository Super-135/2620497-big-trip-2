import { render, RenderPosition } from '../framework/render.js';
import Filters from '../view/filters.js';
import Sorting from '../view/sorting.js';
import ButtonNewEvent from '../view/button-new-event.js';
import NoEvent from '../view/no-event.js';
import TripInfo from '../view/trip-info.js';
import { generateFilter } from '../mock/filter.js';
import WaypointPresenter from './waypoint-presenter.js';
import WaypointListView from '../view/waypoint-list-view.js';
import { updateItem } from '../mock/utils.js';
export default class TripPresenter {
  #headerContainer;
  #mainContainer;
  #waypointModel;
  #sorting = new Sorting();
  #buttonNewEvent = new ButtonNewEvent();
  #tripInfo = new TripInfo();
  #waypointListComponent;
  #waypoints = [];
  #waypointPresenters = new Map();

  constructor({ headerContainer, mainContainer, waypointModel }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#waypointModel = waypointModel;
    this.#waypointListComponent = new WaypointListView();
  }

  init() {
    this.#waypoints = [...this.#waypointModel.waypoints];
    this.#renderApp();
    render(this.#waypointListComponent, this.#mainContainer);
  }

  #renderWaypoint(point) {
    const waypointPresenter = new WaypointPresenter({
      waypointListComponent: this.#waypointListComponent,
      waypointModel: this.#waypointModel,
      onDataChange: this.#handleWaypointChange,
      onModeChange: this.#handleModeChange,
    });
    waypointPresenter.init(point);
    this.#waypointPresenters.set(point.id, waypointPresenter);
  }

  #clearWaypointList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleWaypointChange = (updatedWaypoint) => {
    this.#waypoints = updateItem(this.#waypoints, updatedWaypoint);
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  #renderFilters() {
    const filters = generateFilter(this.#waypoints);
    render(new Filters({ filters }), this.#headerContainer);
  }

  #renderButtonNewEvent() {
    render(this.#buttonNewEvent, this.#headerContainer, RenderPosition.AFTEREND);
  }

  #renderTripInfo() {
    render(this.#tripInfo, this.#headerContainer, RenderPosition.BEFOREBEGIN);
  }

  #renderNoEvent() {
    render(new NoEvent(), this.#mainContainer);
  }

  #renderApp() {
    this.#renderFilters();
    this.#renderButtonNewEvent();
    this.#renderTripInfo();
    if (this.#waypoints.length === 0) {
      this.#renderNoEvent();
      return;
    }
    render(this.#sorting, this.#mainContainer);
    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderWaypoint(this.#waypoints[i]);
    }
  }
}
