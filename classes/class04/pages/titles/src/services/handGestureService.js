export default class HandGestureService {
  #gestureEstimator;
  #handPoseDetection;
  #handsVersion;
  #detector;
  #gestureString;

  constructor({
    fingerpose,
    handPoseDetection,
    handsVersion,
    knownGestures,
    gestureStrings,
  }) {
    this.#gestureEstimator = new fingerpose.GestureEstimator(knownGestures);
    this.#handPoseDetection = handPoseDetection;
    this.#handsVersion = handsVersion;
    this.#gestureString = gestureStrings;
  }

  async estimate(keypoints3d) {
    const predictions = await this.#gestureEstimator.estimate(
      this.#getLandMarksFromKeyPoints(keypoints3d),
      // porcentagem de confiança do gesto 90%
      9
    );

    return predictions.gestures;
  }

  async *detectGestures(predictions) {
    for (const hand of predictions) {
      if (!hand.keypoints3d) continue;
      const gestures = await this.estimate(hand.keypoints3d);

      if (!gestures.length) continue;

      const result = gestures.reduce((acc, current) =>
        acc.score > current.score ? acc : current
      );

      const { x, y } = hand.keypoints.find(
        (keypoint) => keypoint.name === 'index_finger_tipe'
      );

      yield { event: result.name, x, y };
    }
  }

  #getLandMarksFromKeyPoints(keypoints3d) {
    return keypoints3d.map((point) => [point.x, point.y, point.z]);
  }

  async estimateHands(video) {
    return this.#detector.estimateHands(video, {
      flipHorizontal: true,
    });
  }

  async initializeDetector() {
    if (this.#detector) return this.#detector;
    const model = this.#handPoseDetection.SupportedModels.MediaPipeHands;

    const detectorConfig = {
      runtime: 'mediapipe', // or 'tfjs'
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${
        this.#handsVersion
      }`,
      //full é o mais pesado e o mais preciso
      modelType: 'lite',
      maxHands: 2,
    };

    this.#detector = await this.#handPoseDetection.createDetector(
      model,
      detectorConfig
    );

    return this.#detector;
  }
}
