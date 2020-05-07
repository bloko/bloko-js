let globalState = {};

export function getState() {
  return globalState;
}

export function setState(key, value) {
  globalState[key] = value;
}

export function setNextState(nextState) {
  globalState = nextState;
}

export function isEmpty() {
  return Object.keys(globalState).length === 0;
}

export function clear(key) {
  if (key) {
    delete globalState[key];
  } else {
    globalState = {};
  }
}
