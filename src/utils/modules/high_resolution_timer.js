export const HighResolutionTimer = (name = '', startNow = false, {
  performance = window.performance,
  round = true,
} = {}) => {
  let startTime, stopTime;
  if (startNow) start();
  return {
    start: start,
    stop: stop
  };

  function start() {
    startTime = performance.now();
  }

  function stop(message = '') {
    stopTime = performance.now();
    const result = stopTime - startTime;
    const text = `${name} ${message} time: ${round ? Math.round(result) : result}`;
    console.warn(text);
    return text;
  }
};