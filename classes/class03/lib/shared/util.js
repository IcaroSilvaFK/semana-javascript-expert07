function supportsWorkerType() {
  let supports = false;

  const tester = {
    get type() {
      supports = true;
    },
  };

  try {
    new Worker('blob://', tester).terminate();
  } catch (err) {
    console.log(err);
  } finally {
    return supports;
  }
}

function prepareRunChecker({ timerDelay }) {
  let lastEvent = Date.now();

  return {
    shouldRun() {
      const result = Date.now() - lastEvent > timerDelay;

      if (result) lastEvent = Date.now();

      return result;
    },
  };
}

export { supportsWorkerType, prepareRunChecker };
