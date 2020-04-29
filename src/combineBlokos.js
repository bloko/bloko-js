import createBloko from './createBloko';
import { blokos } from './utils/state';

function combineBlokos(obj) {
  return Object.keys(obj).forEach(name => {
    const bloko = createBloko(name, obj[name]);

    blokos.set(name, addContextToBloko(name, bloko));
  });
}

function addContextToBloko(name, bloko) {
  const _actions = Object.keys(bloko.actions).reduce((acc, actionName) => {
    acc[actionName] = async (context, payload, repositoryOptions) => {
      const action = await bloko.actions[actionName](payload);

      context.globalState = context.state;
      context.state = context.state[name];

      return action(context, repositoryOptions);
    };

    return acc;
  }, {});

  return {
    state: bloko.state,
    actions: _actions,
  };
}

export default combineBlokos;
