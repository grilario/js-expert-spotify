export default class Controller {
  constructor({ view, service }) {
    this.view = view;
    this.service = service;
  }

  static initialize(dependecies) {
    const controller = new Controller(dependecies);
    controller.onLoad();
    return controller;
  }

  async commandReceived(text) {
    return this.service.makeRequest({ command: text });
  }

  onLoad() {
    this.view.configureOnBtnClick(this.commandReceived.bind(this));
    this.view.onLoad();
  }
}
  