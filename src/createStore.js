import createUnit from './createUnit';
import isFunction from './utils/isFunction';
import isObject from './utils/isObject';
import merge from './utils/merge';

const requestBloko = createUnit({
  loading: undefined,
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

      bloko = type;

      if (setter) {
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        _actions[`set${capitalizedName}`] = function execute(context, payload) {
          let nextState = null;

          if (payload) {
            const state = context.getState()[key][name];
            const _payload = evaluate(payload, state);

            nextState = Object.assign({}, state || bloko());

            merge(nextState, _payload);
          }

          context.commit({ [name]: nextState });
        };
      }
    }

    _state[name] = bloko();
  });

  Object.keys(actions).forEach(name => {
    const { request, resolved, loading } = actions[name];

    let _loading = isFunction(loading) ? loading : () => true;

    _state[name] = requestBloko();

    _actions[name] = async function execute(context, payload) {
      const state = context.getState()[key];

      try {
        const loadingState = await _loading(payload, state);

        context.commit({ [name]: { loading: loadingState, error: '' } });

        const data = await request(payload);
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

function evaluate(value, state) {
  if (isFunction(value)) {
    return value(state);
  }

  return value;
}

export default createStore;
