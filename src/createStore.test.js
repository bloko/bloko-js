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

  it('should not initialize setters when bloko.setter are not true', () => {
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

  it('should initialize unit blokos inside state with setters', () => {
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

  it('should handle actions correctly', async () => {
    const storeKey = 'key';
    const blokoName = 'bloko';
    const capitalizedBlokoName =
      blokoName.charAt(0).toUpperCase() + blokoName.slice(1);
    const actionName = 'myAction';
    const payload = { foo: 'bar' };
    const repository = jest.fn(() => ({ [blokoName]: payload }));
    const resolved = jest.fn(data => data);
    const commit = jest.fn(data => {
      globalState.setState(storeKey, data);
    });
    let contextMock = { commit, getState: globalState.getState };

    globalState.setState(storeKey, { [blokoName]: blokoDescriptor });

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
          repository,
          resolved,
        },
      },
    });

    const action = Store.actions[actionName];

    const initialBlokoState = globalState.getState()[storeKey];

    await action(contextMock, payload);

    const nextBlokoState = globalState.getState()[storeKey];

    expect(nextBlokoState).toEqual({ [blokoName]: payload });
    expect(repository).toHaveBeenCalledTimes(1);
    expect(repository).toHaveBeenCalledWith(payload);
    expect(resolved).toHaveBeenCalledTimes(1);
    expect(resolved).toHaveBeenCalledWith(
      { [blokoName]: payload },
      initialBlokoState
    );
    expect(contextMock.commit).toHaveBeenCalledTimes(1);
    expect(contextMock.commit).toHaveBeenCalledWith({ [blokoName]: payload });

    contextMock.commit.mockClear();

    const setterPayload = { foo: 'bar2' };
    const setterAction = Store.actions[`set${capitalizedBlokoName}`];

    setterAction(contextMock, setterPayload);

    const expectedBlokoState = {
      [blokoName]: {
        ...blokoDescriptor,
        ...setterPayload,
      },
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
});
