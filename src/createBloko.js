import getActionInterface from './getters/getActionInterface';
import getModel from './getters/getModel';
import getRepository from './getters/getRepository';
import getTransition from './getters/getTransition';

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
      instance,
      actionName,
      blokoName
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

export default createBloko;
