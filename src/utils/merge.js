import isObject from './isObject';

function merge(obj, payload) {
  const sanitizePayload = createSanitizer(obj);
  const keys = Object.keys(payload).filter(sanitizePayload);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = payload[key];

    if (isObject(value)) {
      merge(obj[key], value);
    } else {
      obj[key] = value;
    }
  }
}

function createSanitizer(obj) {
  return function sanitizer(key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
}

export default merge;
