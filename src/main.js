import TripPresenter from './presenter/trip-presenter.js';
import WaypointModel from './model/waypoint-model.js';
import OffersModel from './model/offers-model.js';
import DestinationModel from './model/destination-model.js';
import FilterModel from './model/filter-model.js';
import ButtonNewEvent from './view/button-new-event.js';
import WaypointsApiService from './waypoints-api-service.js';
import { render, RenderPosition } from './framework/render.js';
import { handleButtonDisabled } from './utils/common.js';
import { AUTHORIZATION, END_POINT } from './utils/constants.js';

const siteFiltersElement = document.querySelector('.trip-main__trip-controls');
const siteMainElement = document.querySelector('.trip-events');
const waypointsApiService = new WaypointsApiService(END_POINT, AUTHORIZATION);

const waypointModel = new WaypointModel({ waypointsApiService: waypointsApiService });
const offersModel = new OffersModel({ waypointsApiService: waypointsApiService });
const destinationModel = new DestinationModel({ waypointsApiService: waypointsApiService });
const filterModel = new FilterModel();
const newEventButtonComponent = new ButtonNewEvent({
  onClick: handleNewEventButtonClick
});

const presenter = new TripPresenter({ headerContainer: siteFiltersElement, mainContainer: siteMainElement, waypointModel, offersModel, destinationModel, filterModel, newEventButtonComponent, onNewEventDestroy: handleNewEventFormClose });

function handleNewEventFormClose() {
  presenter.getPageUpdate({ isOpen: false });
  handleButtonDisabled(false, newEventButtonComponent);
}

function handleNewEventButtonClick() {
  presenter.createNewWaypoint();
  presenter.getPageUpdate();
  handleButtonDisabled(true, newEventButtonComponent);
}

Promise.all([destinationModel.init(), offersModel.init()])
  .then(() => waypointModel.init())
  .then(handleButtonDisabled(false, newEventButtonComponent))
  .finally(() => {
    render(newEventButtonComponent, siteFiltersElement, RenderPosition.AFTEREND);
  });

presenter.init();
