import createUnit from './createUnit';
import isFunction from './utils/isFunction';
import isObject from './utils/isObject';

const requestBloko = createUnit({
  loading: false,
  error: '',
});

function createStore(descriptor) {
  const { key, state, actions } = descriptor;

  let _state = {};
  let _actions = {};

  Object.keys(state).forEach(name => {
    let bloko;

    if (!isObject(state[name])) {
      bloko = state[name];
    } else {
      const { type, setter } = state[name];

      if (setter) {
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        _actions[`set${capitalizedName}`] = function execute(context, payload) {
          let _payload = payload;

          if (isFunction(payload)) {
            const state = context.getState()[key][name];

            _payload = payload(state);
          }

          context.commit({ [name]: _payload });
        };
      }

      bloko = type;
    }

    _state[name] = bloko();
  });

  Object.keys(actions).forEach(name => {
    const { repository, resolved, loading } = actions[name];

    let _loading = isFunction(loading) ? loading : () => true;

    _state[name] = requestBloko();

    _actions[name] = async function execute(context, payload) {
      const state = context.getState()[key];

      try {
        const loadingState = await _loading(payload, state);

        context.commit({ [name]: { loading: loadingState, error: '' } });

        const data = await repository(payload);
        const nextState = await resolved(data, state);

        /* istanbul ignore else */
        if (nextState) {
          context.commit(nextState);
        }
      } catch (error) {
        const currentRequestState = context.getState()[key][name];

        context.commit({
          [name]: {
            ...currentRequestState,
            error: error.message,
          },
        });
      } finally {
        const currentRequestState = context.getState()[key][name];

        context.commit({
          [name]: {
            ...currentRequestState,
            loading: false,
          },
        });
      }
    };
  });

  return {
    key,
    state: _state,
    actions: _actions,
  };
}

export default createStore;
