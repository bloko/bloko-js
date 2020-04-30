import createRepository from './createRepository';
import createTransition from './createTransition';
import getModel from './utils/getModel';

function createBloko(blokoName, Bloko) {
  let _state = {};
  let _actions = {};

  Bloko.displayName = blokoName;

  const instance = new Bloko();
  const actionNames = getBlokoActions(instance);

  let initialState = {};

  if (Bloko.initialState) {
    initialState = Bloko.initialState();
  }

  Object.keys(initialState).forEach(key => {
    const modelName = initialState[key];
    const Model = getModel(modelName);

    _state[key] = new Model({});
  });

  actionNames.forEach(actionName => {
    const isLoadingActionName =
      'isLoading' + actionName.charAt(0).toUpperCase() + actionName.slice(1);

    _state[isLoadingActionName] = false;

    const { repository, transition, success, failure } = getActionInterface(
      blokoName,
      actionName,
      instance
    );

    _actions[actionName] = function execute(payload) {
      return async function (context, repositoryOptions) {
        try {
          const transitionHandlers = getTransition(transition);
          const repositoryHandler = getRepository(
            repository,
            repositoryOptions
          );

          context.commit({ [isLoadingActionName]: true });

          const payloadAfterTransition = transitionHandlers.input(payload);
          const data = await repositoryHandler(payloadAfterTransition);
          const dataAfterTransition = transitionHandlers.output(data);

          success(context, dataAfterTransition);

          return dataAfterTransition;
        } catch (error) {
          failure(context, error);

          throw error;
        } finally {
          context.commit({ [isLoadingActionName]: false });
        }
      };
    };
  });

  return {
    state: _state,
    actions: _actions,
  };
}

function getBlokoActions(instance) {
  const proto = Object.getPrototypeOf(instance);
  const propNames = Object.getOwnPropertyNames(proto);

  return propNames.filter(propName => propName !== 'constructor');
}

function getActionInterface(blokoName, actionName, instance) {
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

function isObject(value) {
  return !!(value && typeof value === 'object' && !Array.isArray(value));
}

const cache = new Map();

function getRepository(repository, repositoryOptions) {
  let cached = cache.get(repository);

  if (!cached) {
    cached =
      typeof repository === 'string'
        ? createRepository(repository, repositoryOptions)
        : data => repository(data, repositoryOptions);

    cache.set(repository, cached);
  }

  return cached;
}

function getTransition(transition) {
  let cached = cache.get(transition);

  if (!cached) {
    if (typeof transition === 'string') {
      cached = createTransition(transition);
    } else {
      transition.input = transition.input || identity;
      transition.output = transition.output || identity;

      cached = transition;
    }

    cache.set(transition, cached);
  }

  return cached;
}

function identity(v) {
  return v;
}

/* istanbul ignore next */
function noop() {}

export default createBloko;
