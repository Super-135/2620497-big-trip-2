import FilterPresenter from './filter-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import Sorting from '../view/sorting.js';
import NoEvent from '../view/no-event.js';
import TripInfo from '../view/trip-info.js';
import WaypointPresenter from './waypoint-presenter.js';
import WaypointListView from '../view/waypoint-list-view.js';
import Loading from '../view/loading.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { generateSorting } from '../utils/sort.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { sortWaypointByDate, sortWaypointByPrice, sortWaypointByDuration, filter } from '../utils/utilities.js';
import { SortType, UpdateType, UserAction, FilterType } from '../utils/constants.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class TripPresenter {
  #headerContainer;
  #mainContainer;
  #waypointModel;
  #offersModel;
  #destinationModel;
  #filterModel;
  #sorting;
  #tripInfo = new TripInfo();
  #loadingComponent = new Loading();
  #waypointListComponent;
  #noEventComponent;
  #waypointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sortingState = generateSorting(this.#currentSortType);
  #filterType = FilterType.EVERYTHING;
  #newEventPresenter;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ headerContainer, mainContainer, waypointModel, offersModel, destinationModel, filterModel, onNewEventDestroy }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#waypointModel = waypointModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;
    this.#filterModel = filterModel;
    this.#waypointListComponent = new WaypointListView();

    this.#waypointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newEventPresenter = new NewEventPresenter({
      destinationModel: this.#destinationModel,
      offersModel: this.#offersModel,
      pointListContainer: this.#waypointListComponent,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy,
    });
  }

  get waypoints() {
    this.#filterType = this.#filterModel.filter;
    const waypoints = this.#waypointModel.waypoints;
    const filteredWaypoints = filter[this.#filterType](waypoints);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredWaypoints.sort(sortWaypointByDate);
      case SortType.TIME:
        return filteredWaypoints.sort(sortWaypointByDuration);
      case SortType.PRICE:
        return filteredWaypoints.sort(sortWaypointByPrice);
    }
    return filteredWaypoints.sort(sortWaypointByDate);
  }

  init() {
    this.#renderApp();
    render(this.#waypointListComponent, this.#mainContainer);
  }

  #renderWaypoint(point) {
    const waypointPresenter = new WaypointPresenter({
      waypointListComponent: this.#waypointListComponent,
      waypointModel: this.#waypointModel,
      offersModel: this.#offersModel,
      destinationModel: this.#destinationModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    waypointPresenter.init(point);
    this.#waypointPresenters.set(point.id, waypointPresenter);
  }

  createNewWaypoint() {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#clearWaypointList({ resetSortType: true });
    this.#renderWaypointList();
    this.#newEventPresenter.init();
  }

  #clearWaypointList(resetSortType = false) {
    this.#newEventPresenter.destroy();
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();

    remove(this.#sorting);
    remove(this.#loadingComponent);

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderWaypointList() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const waypointCount = this.waypoints.length;
    const waypoints = this.waypoints.slice(0, waypointCount);
    if (waypointCount === 0) {
      this.#renderNoEvent();
      return;
    }
    this.#renderSort();
    for (let i = 0; i < waypointCount; i++) {
      this.#renderWaypoint(waypoints[i]);
    }
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointPresenters.get(update.id).setSaving();
        try {
          await this.#waypointModel.updateWaypoint(updateType, update);
        } catch (err) {
          this.#waypointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_WAYPOINT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#waypointModel.addWaypoint(updateType, update);
        } catch (err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointPresenters.get(update.id).setDeleting();
        try {
          this.#waypointModel.deleteWaypoint(updateType, update);
        } catch (err) {
          this.#waypointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearWaypointList();
        this.#renderWaypointList();
        break;
      case UpdateType.MAJOR:
        this.#clearWaypointList({ resetSortType: true });
        this.#renderWaypointList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderWaypointList();
        break;
    }
  };

  #renderFilters() {
    const filterPresenter = new FilterPresenter({
      filterContainer: this.#headerContainer,
      filterModel: this.#filterModel,
      waypointModel: this.#waypointModel,
    });
    filterPresenter.init();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#mainContainer);
  }

  #renderTripInfo() {
    render(this.#tripInfo, this.#headerContainer, RenderPosition.BEFOREBEGIN);
  }

  #renderNoEvent() {
    this.#noEventComponent = new NoEvent({ filterType: this.#filterType });
    render(this.#noEventComponent, this.#mainContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearWaypointList();
    this.#renderWaypointList();
  };

  #renderSort() {
    this.#sortingState = generateSorting(this.#currentSortType);
    this.#sorting = new Sorting({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
      sorting: this.#sortingState,
    });

    render(this.#sorting, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderApp() {
    this.#renderFilters();
    this.#renderTripInfo();
    this.#renderWaypointList();
  }
}
