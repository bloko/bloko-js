import identity from './identity';
import isObject from './isObject';
import noop from './noop';

function getActionInterface(instance, actionName, blokoName) {
  const allowedKeys = {
    repository: ['string', 'function'],
    transition: ['string', 'object'],
    success: 'function',
    failure: 'function',
  };

  const _interface = instance[actionName]();

  if (!isObject(_interface)) {
    const stringOfAllowedKeys = Object.keys(allowedKeys).join(', ');

    throw new Error(
      `[${blokoName}]: action ${actionName} must return an object containing ${stringOfAllowedKeys}`
    );
  }

  // failure and transition key can be optional
  _interface.failure = _interface.failure || noop;
  _interface.transition = _interface.transition || {
    input: identity,
    output: identity,
  };

  Object.entries(allowedKeys).forEach(([key, allowed]) => {
    const error = findInterfaceError(_interface, key, allowed);

    if (error) {
      throw new Error(
        `[${blokoName}]: action ${actionName} must implement ${error.key} as a ${error.value}`
      );
    }
  });

  return _interface;
}

function findInterfaceError(_interface, key, allowedTypes) {
  const value = _interface[key];
  const types = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];

  if (types.indexOf(typeof value) === -1) {
    return {
      key,
      value: types.join(' or '),
    };
  }

  if (key === 'transition') {
    if (typeof _interface[key] === 'object') {
      if (
        _interface[key].input &&
        typeof _interface[key].input !== 'function'
      ) {
        return {
          key: `${key}.input`,
          value: 'function',
        };
      }

      if (
        _interface[key].output &&
        typeof _interface[key].output !== 'function'
      ) {
        return {
          key: `${key}.output`,
          value: 'function',
        };
      }
    }
  }

  return null;
}

export default getActionInterface;
