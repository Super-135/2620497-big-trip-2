import { render, replace, remove } from '../framework/render.js';
import Filters from '../view/filters.js';
import { filter } from '../utils/utilities.js';
import { FilterType, UpdateType } from '../utils/constants.js';

export default class FilterPresenter {
  #filterContainer;
  #filterModel;
  #waypointModel;

  #filterComponent = null;

  constructor({ filterContainer, filterModel, waypointModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#waypointModel = waypointModel;

    this.#waypointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const waypoints = [...this.#waypointModel.waypoints];

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](waypoints).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new Filters({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
