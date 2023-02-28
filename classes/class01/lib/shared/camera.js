export default class Camera {
  constructor() {
    this.video = document.createElement('video');
  }

  static async init() {
    if (!navigator.mediaDevices || !navigator.mediaDevices?.getUserMedia()) {
      throw new Error(
        `Browser API navigator.mediaDevices.getUserMedia() is not available`
      );
    }
    const viewConfig = {
      audio: false,
      video: {
        width: globalThis.screen.availWidth,
        height: globalThis.screen.availHeight,
        frameRate: {
          ideal: 60,
        },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(viewConfig);
    const camera = new Camera();

    camera.video.srcObject = stream;

    camera.video.height = 240;
    camera.video.width = 320;

    document.body.insertAdjacentElement('beforeend', camera.video);
  }
}
