export default class Controller {
  #view;
  #worker;
  #blinkCounter = 0;
  #camera;

  constructor({ view, worker, camera }) {
    this.#view = view;
    this.#camera = camera;
    this.#worker = this.#configureWorker(worker);

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this));
  }

  static async initialize(deps) {
    const controller = new Controller(deps);
    controller.log('not yet detecting eye blink! click in the button to start');
    return controller.init();
  }

  async init() {}

  loop() {
    const video = this.#camera.video;
    const img = this.#view.getVideoFrame(video);

    this, this.#worker.send(img);
    this.log(`detecting eye blink...`);

    setTimeout(() => this.loop(), 100);
  }

  #configureWorker(worker) {
    let ready = false;
    worker.onmessage = ({ data }) => {
      if ('READY' === data) {
        this.#view.enableButton();
        ready = true;
        return;
      }

      const blinked = data.blinked;
      console.log('blinked', blinked);
      this.#blinkCounter += blinked;
    };
    return {
      send(msg) {
        if (!ready) {
          return;
        }
        worker.postMessage(msg);
      },
    };
  }

  log(text) {
    const times = `    - blinked times: ${this.#blinkCounter}`;
    this.#view.log(
      `logger: ${text} timestamp:${new Date()}`.concat(
        this.#blinkCounter ? times : ''
      )
    );
  }

  onBtnStart() {
    this.log('initializing detection...');
    this.#blinkCounter = 0;
    this.loop();
  }
}
