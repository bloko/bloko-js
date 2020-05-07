import * as globalState from './globalState';

describe('globalState', () => {
  it('should get empty object on initialState', () => {
    const state = globalState.getState();
    const emptyObject = {};

    expect(state).toEqual(emptyObject);
  });

  it('should get isEmpty true on initialState', () => {
    const isEmpty = globalState.isEmpty();

    expect(isEmpty).toEqual(true);
  });

  it('should handle partial state with setState and clear with key', () => {
    const emptyObject = {};
    const key = 'key';
    const value = { foo: 'bar' };

    globalState.setState(key, value);

    expect(globalState.getState()).toEqual({
      [key]: value,
    });

    globalState.clear(key);

    expect(globalState.getState()).toEqual(emptyObject);
  });

  it('should handle full state with setState and clear without key', () => {
    const emptyObject = {};
    const nextState = {
      foo: {
        bar: 'bar',
      },
      baz: {
        waz: 'waz',
      },
    };

    globalState.setNextState(nextState);

    expect(globalState.getState()).toEqual(nextState);

    globalState.clear();

    expect(globalState.getState()).toEqual(emptyObject);
  });
});
