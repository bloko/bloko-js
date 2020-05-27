import createStore from './createStore';
import createUnit from './createUnit';
import * as globalState from './utils/globalState';

const blokoDescriptor = {
  foo: '',
};

const Bloko = createUnit(blokoDescriptor);

describe('createStore', () => {
  it('should initialize unit blokos inside state', () => {
    const storeKey = 'key';

    const Store = createStore({
      key: storeKey,
      state: {
        bloko: Bloko,
      },
      actions: {},
    });

    expect(Store.state).toEqual({ bloko: blokoDescriptor });
  });

  it('should not initialize setter when bloko.setter are not true', () => {
    const storeKey = 'key';
    const blokoName = 'bloko';

    const Store = createStore({
      key: storeKey,
      state: {
        [blokoName]: {
          type: Bloko,
          setter: false,
        },
      },
      actions: {},
    });

    expect(Store.state).toEqual({ [blokoName]: blokoDescriptor });
    expect(Store.actions).toEqual({});
  });

  it('should initialize unit blokos inside state with setter', () => {
    const storeKey = 'key';
    const blokoName = 'bloko';
    const capitalizedBlokoName =
      blokoName.charAt(0).toUpperCase() + blokoName.slice(1);

    const Store = createStore({
      key: storeKey,
      state: {
        [blokoName]: {
          type: Bloko,
          setter: true,
        },
      },
      actions: {},
    });

    expect(Store.state).toEqual({ [blokoName]: blokoDescriptor });
    expect(Store.actions).toEqual({
      [`set${capitalizedBlokoName}`]: expect.any(Function),
    });
  });

  it('should initialize state with request state when has any action', () => {
    const storeKey = 'key';
    const blokoName = 'bloko';
    const actionName = 'myAction';

    const Store = createStore({
      key: storeKey,
      state: {
        [blokoName]: Bloko,
      },
      actions: {
        [actionName]: {},
      },
    });

    expect(Store.state).toEqual({
      [blokoName]: blokoDescriptor,
      [actionName]: {
        loading: undefined,
        error: '',
      },
    });
    expect(Store.actions).toEqual({
      [actionName]: expect.any(Function),
    });
  });

  it('should handle actions correctly', async () => {
    const storeKey = 'key';
    const blokoName = 'bloko';
    const capitalizedBlokoName =
      blokoName.charAt(0).toUpperCase() + blokoName.slice(1);
    const actionName = 'myAction';
    const payload = { foo: 'bar' };
    const request = jest.fn(() => ({ [blokoName]: payload }));
    const loading = jest.fn(data => data);
    const resolved = jest.fn(data => data);
    const commit = jest.fn(data => {
      const currentState = globalState.getState();
      const nextState = { ...currentState[storeKey], ...data };

      globalState.setState(storeKey, nextState);
    });
    let contextMock = { commit, getState: globalState.getState };

    globalState.setState(storeKey, {
      [blokoName]: blokoDescriptor,
      [actionName]: { loading: false, error: '' },
    });

    const Store = createStore({
      key: storeKey,
      state: {
        [blokoName]: {
          type: Bloko,
          setter: true,
        },
      },
      actions: {
        [actionName]: {
          loading,
          request,
          resolved,
        },
      },
    });

    const action = Store.actions[actionName];

    const initialBlokoState = globalState.getState()[storeKey];

    await action(contextMock, payload);

    const nextBlokoState = globalState.getState()[storeKey];

    expect(nextBlokoState).toEqual({
      [blokoName]: payload,
      [actionName]: { loading: false, error: '' },
    });
    expect(loading).toHaveBeenCalledTimes(1);
    expect(loading).toHaveBeenCalledWith(payload, initialBlokoState);
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(payload);
    expect(resolved).toHaveBeenCalledTimes(1);
    expect(resolved).toHaveBeenCalledWith(
      { [blokoName]: payload },
      initialBlokoState
    );

    const startLoading = contextMock.commit.mock.calls[0][0];
    const resolvedCommit = contextMock.commit.mock.calls[1][0];
    const endLoading = contextMock.commit.mock.calls[2][0];

    expect(startLoading).toEqual({
      [actionName]: { loading: payload, error: '' },
    });
    expect(resolvedCommit).toEqual({ [blokoName]: payload });
    expect(endLoading).toEqual({ [actionName]: { loading: false, error: '' } });

    contextMock.commit.mockClear();

    const setterPayload = { foo: 'bar2' };
    const setterAction = Store.actions[`set${capitalizedBlokoName}`];

    setterAction(contextMock, setterPayload);

    const expectedBlokoState = {
      [blokoName]: {
        ...blokoDescriptor,
        ...setterPayload,
      },
      [actionName]: { loading: false, error: '' },
    };

    expect(globalState.getState()[storeKey]).toEqual(expectedBlokoState);
    expect(contextMock.commit).toHaveBeenCalledTimes(1);
    expect(contextMock.commit).toHaveBeenCalledWith({
      [blokoName]: setterPayload,
    });

    contextMock.commit.mockClear();

    const _setterPayload = { foo: 'bar' };

    globalState.setState(storeKey, { [blokoName]: _setterPayload });

    const setterPayloadFn = state => ({ foo: state.foo + '!' });

    setterAction(contextMock, setterPayloadFn);

    expect(globalState.getState()[storeKey]).toEqual({
      [blokoName]: {
        ...blokoDescriptor,
        ...{ foo: _setterPayload.foo + '!' },
      },
    });
    expect(contextMock.commit).toHaveBeenCalledTimes(1);
    expect(contextMock.commit).toHaveBeenCalledWith({
      [blokoName]: {
        foo: _setterPayload.foo + '!',
      },
    });
  });

  it('should handle rejected actions', async () => {
    const storeKey = 'key';
    const actionName = 'myAction';
    const payload = { foo: 'bar' };
    const errorMessage = 'errorMessage';
    const request = jest.fn(() => Promise.reject(new Error(errorMessage)));
    const resolved = jest.fn(data => data);
    const commit = jest.fn(data => {
      const currentState = globalState.getState();
      const nextState = { ...currentState[storeKey], ...data };

      globalState.setState(storeKey, nextState);
    });
    let contextMock = { commit, getState: globalState.getState };

    globalState.setState(storeKey, {
      [actionName]: { loading: false, error: '' },
    });

    const Store = createStore({
      key: storeKey,
      state: {},
      actions: {
        [actionName]: {
          request,
          resolved,
        },
      },
    });

    const action = Store.actions[actionName];

    await action(contextMock, payload);

    const nextBlokoState = globalState.getState()[storeKey];

    expect(nextBlokoState).toEqual({
      [actionName]: { loading: false, error: errorMessage },
    });
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(payload);
    expect(resolved).toHaveBeenCalledTimes(0);

    const startLoading = contextMock.commit.mock.calls[0][0];
    const rejectedCommit = contextMock.commit.mock.calls[1][0];
    const endLoading = contextMock.commit.mock.calls[2][0];

    expect(startLoading).toEqual({
      [actionName]: { loading: true, error: '' },
    });
    expect(rejectedCommit).toEqual({
      [actionName]: { loading: true, error: errorMessage },
    });
    expect(endLoading).toEqual({
      [actionName]: { loading: false, error: errorMessage },
    });
  });
});
