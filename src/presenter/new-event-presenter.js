import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, DEFAULT_TYPE } from '../utils/constants.js';
import FormEdit from '../view/form-edit.js';

export default class NewEventPresenter {

  #pointListContainer;
  #handleDataChange;
  #handleDestroy;
  #destinationModel;
  #offersModel;

  #formComponent = null;

  constructor({ pointListContainer, onDataChange, onDestroy, destinationModel, offersModel }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
  }

  init() {
    if (this.#formComponent !== null) {
      return;
    }

    this.#formComponent = new FormEdit({
      waypoint: { type: DEFAULT_TYPE, basePrice: 0 },
      offers: [],
      destination: { name: '', pictures: [], description: '' },
      offersType: this.#offersModel.getOffersByType(DEFAULT_TYPE),
      destinationAll: this.#destinationModel.destinations,
      offersAll: [...this.#offersModel.offers],
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      isEditMode: false,
    });

    render(this.#formComponent, this.#pointListContainer.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#formComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#formComponent);
    this.#formComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      point,
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
