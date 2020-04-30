import getState from './getState';
import { blokos } from './state';

describe('getState', () => {
  it('should get empty object when no bloko are registered', () => {
    const state = getState();
    const emptyObject = {};

    expect(state).toEqual(emptyObject);
  });

  it('should match correct state when blokos are registered', () => {
    const blokoNameOne = 'BlokoMockOne';
    const blokoNameTwo = 'BlokoMockTwo';
    const emptyObject = {};

    blokos.set(blokoNameOne, { state: emptyObject });
    blokos.set(blokoNameTwo, { state: emptyObject });

    const state = getState();

    expect(state).toEqual({
      [blokoNameOne]: emptyObject,
      [blokoNameTwo]: emptyObject,
    });

    blokos.delete(blokoNameOne);
    blokos.delete(blokoNameTwo);
  });
});
