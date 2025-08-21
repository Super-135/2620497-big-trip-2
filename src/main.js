import TripPresenter from './presenter/trip-presenter.js';
import WaypointModel from './model/waypoint-model.js';
import OffersModel from './model/offers-model.js';
import DestinationModel from './model/destination-model.js';
import FilterModel from './model/filter-model.js';
import ButtonNewEvent from './view/button-new-event.js';
import WaypointsApiService from './waypoints-api-service.js';
import { render, RenderPosition } from './framework/render.js';

const AUTHORIZATION = 'Basic random101string';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const siteFiltersElement = document.querySelector('.trip-main__trip-controls');
const siteMainElement = document.querySelector('.trip-events');
const waypointModel = new WaypointModel({
  waypointsApiService: new WaypointsApiService(END_POINT, AUTHORIZATION)
});
const offersModel = new OffersModel({
  waypointsApiService: new WaypointsApiService(END_POINT, AUTHORIZATION)
});
const destinationModel = new DestinationModel({
  waypointsApiService: new WaypointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const presenter = new TripPresenter({ headerContainer: siteFiltersElement, mainContainer: siteMainElement, waypointModel, offersModel, destinationModel, filterModel, onNewEventDestroy: handleNewEventFormClose });

const newEventButtonComponent = new ButtonNewEvent({
  onClick: handleNewEventButtonClick
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  presenter.createNewWaypoint();
  newEventButtonComponent.element.disabled = true;
}

destinationModel.init().then(() => offersModel.init()).then(() => waypointModel.init()).finally(() => {
  render(newEventButtonComponent, siteFiltersElement, RenderPosition.AFTEREND);
});

presenter.init();
