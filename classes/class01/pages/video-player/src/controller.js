export default class Controller {
  constructor({ view, service }) {}

  static async initialize(deps) {
    const controller = new Controller(deps);
    return controller.init();
  }

  async init() {}
}
