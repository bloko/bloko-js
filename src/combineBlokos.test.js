import combineBlokos from './combineBlokos';
import getState from './utils/getState';
import http from './utils/http';
import { blokos } from './utils/state';

describe('combineBlokos', () => {
  it('should correctly combine valid blokos', () => {
    const blokoName = 'A';

    class A {}

    combineBlokos({ A });

    expect(blokos.size).toEqual(1);
    expect(blokos.has(blokoName)).toEqual(true);

    blokos.delete(blokoName);
  });

  it('should correctly add context to valid blokos', async () => {
    const actionName = 'myAction';
    const blokoDisplayName = 'Bloko';
    const httpInstance = http.instance();
    const method = 'get';
    const endpoint = '/';
    const blokoRepository = `${method.toUpperCase()} ${endpoint}`;
    const blokoSuccess = jest.fn((context, data) => {
      context.commit(data);
    });

    class Bloko {
      [actionName]() {
        return {
          repository: blokoRepository,
          success: blokoSuccess,
        };
      }
    }

    const payload = { foo: 'bar' };

    httpInstance[method].mockResolvedValue(payload);

    combineBlokos({ [blokoDisplayName]: Bloko });

    const bloko = blokos.get(blokoDisplayName);
    const action = bloko.actions[actionName];

    const state = getState();

    const contextMock = {
      commit: jest.fn(),
      state,
    };

    await action(contextMock, payload);

    expect(contextMock).toEqual({
      commit: expect.any(Function),
      globalState: state,
      state: state[blokoDisplayName],
    });
  });
});
