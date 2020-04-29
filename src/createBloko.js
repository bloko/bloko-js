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
    repository: 'string',
    transition: 'string',
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
  _interface.transition = _interface.transition || 'I -> I';

  Object.entries(allowedKeys).forEach(([key, type]) => {
    const value = _interface[key];
    const hasInInterface = Boolean(value);
    const hasCorrectType = typeof value === type;

    if (!hasInInterface) {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);

      throw new Error(
        `[${blokoName}]: action ${actionName} must implement ${capitalizedKey}`
      );
    }

    if (!hasCorrectType) {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

      throw new Error(
        `[${blokoName}]: action ${actionName} must implement ${capitalizedKey} as a ${capitalizedType}`
      );
    }
  });

  return _interface;
}

/* istanbul ignore next */
function noop() {}

function isObject(value) {
  return !!(value && typeof value === 'object' && !Array.isArray(value));
}

let _cacheRepositories = {};

function getRepository(repository, repositoryOptions) {
  if (!_cacheRepositories[repository]) {
    _cacheRepositories[repository] = createRepository(
      repository,
      repositoryOptions
    );
  }

  return _cacheRepositories[repository];
}

let _cacheTransitions = {};

function getTransition(transition) {
  if (!_cacheTransitions[transition]) {
    _cacheTransitions[transition] = createTransition(transition);
  }

  return _cacheTransitions[transition];
}

export default createBloko;
