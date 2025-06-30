import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../render.js';

export default class Presenter {
  constructor({ tripMainElement, filterContainer, eventsContainer }) {
    this.tripMainElement = tripMainElement;
    this.filterContainer = filterContainer;
    this.eventsContainer = eventsContainer;
    this.eventListComponent = new EventListView();
  }

  init() {
    render(new TripInfoView(), this.tripMainElement, RenderPosition.AFTERBEGIN);
    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);
    render(new EditFormView(), this.eventListComponent.getElement(), RenderPosition.AFTERBEGIN);

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.eventListComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }
}
