import isObject from './isObject';
let state = {};

function getContext() {
  return { commit, state };
}

function commit(partial) {
  Object.keys(partial).forEach(key => {
    const value = partial[key];
    const prevState = state[key];

    if (prevState && isObject(value)) {
      Object.keys(value).forEach(partialKey => {
        state[key][partialKey] = value[partialKey];
      });
    } else {
      state[key] = value;
    }
  });
}

export default getContext;
