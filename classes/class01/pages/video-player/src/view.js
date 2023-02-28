export default class View {
  #btnInit = document.querySelector('#init');
  #statusElement = document.querySelector('#status');
  #videoFrameCanvas = document.createElement('canvas');
  #canvasContext = this.#videoFrameCanvas.getContext('2d', {
    willReadFrequently: true,
  });

  enableButton() {
    this.#btnInit.disabled = false;
  }

  getVideoFrame(video) {
    const canvas = this.#videoFrameCanvas;
    const [width, height] = [video.videoWidth, video.videoHeight];

    canvas.width = width;
    canvas.height = height;

    this.#canvasContext.drawImage(video, 0, 0, width, height);

    return this.#canvasContext.getImageData(0, 0, width, height);
  }

  configureOnBtnClick(fn) {
    this.#btnInit.addEventListener('click', fn);
  }

  log(text) {
    this.#statusElement.textContent = text;
  }
}
