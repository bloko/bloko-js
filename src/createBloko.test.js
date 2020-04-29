import createBloko from './createBloko';
import http from './utils/http';
import Model from './utils/Model';
import { models } from './utils/state';

const contextMock = { commit: jest.fn(), state: {} };

const httpInstance = http.instance();
const method = 'get';
const endpoint = '/';

const blokoDisplayName = 'Bloko';
const blokoRepository = `${method.toUpperCase()} ${endpoint}`;
const blokoSuccess = jest.fn((context, data) => {
  context.commit(data);
});
const blokoFailure = jest.fn((context, error) => {
  context.commit(error.message);
});

describe('createBloko', () => {
  it('should correct initialize state', () => {
    const defaultNameValue = '';

    class User extends Model {
      constructor(props) {
        super(props);

        this.name = props.name || defaultNameValue;
      }
    }

    class Bloko {
      static initialState() {
        return {
          user: 'User',
        };
      }
    }

    models.set('User', User);

    const bloko = createBloko(blokoDisplayName, Bloko);

    const state = {
      user: {
        name: defaultNameValue,
      },
    };

    expect(bloko.state).toEqual(state);
    expect(bloko.state.user instanceof User).toEqual(true);

    models.delete('User');
  });

  it('should throw an interface error for non object return values', () => {
    class Bloko {
      myAction() {
        return undefined;
      }
    }

    function fn() {
      createBloko(blokoDisplayName, Bloko);
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"[Bloko]: action myAction must return an object containing repository, transition, success, failure"`
    );
  });

  it('should throw an interface error for Repository', () => {
    class Bloko {
      myAction() {
        return {};
      }
    }

    function fn() {
      createBloko(blokoDisplayName, Bloko);
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"[Bloko]: action myAction must implement Repository"`
    );
  });

  it('should throw an interface error for Repository type value', () => {
    class Bloko {
      myAction() {
        const incorrectRepositoryDefinition = {};

        return {
          repository: incorrectRepositoryDefinition,
        };
      }
    }

    function fn() {
      createBloko(blokoDisplayName, Bloko);
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"[Bloko]: action myAction must implement Repository as a String"`
    );
  });

  it('should throw an interface error for Success', () => {
    class Bloko {
      myAction() {
        return {
          repository: blokoRepository,
        };
      }
    }

    function fn() {
      createBloko(blokoDisplayName, Bloko);
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"[Bloko]: action myAction must implement Success"`
    );
  });

  it('should not throw when using repository and success handlers', () => {
    class Bloko {
      myAction() {
        return {
          repository: blokoRepository,
          success: blokoSuccess,
        };
      }
    }

    function fn() {
      createBloko(blokoDisplayName, Bloko);
    }

    expect(fn).not.toThrow();
  });

  it('should handle correctly with action repository, transition, success and failure handlers', async () => {
    const actionName = 'myAction';
    const isLoadingName =
      'isLoading' + (actionName.charAt(0).toUpperCase() + actionName.slice(1));

    class Bloko {
      [actionName]() {
        return {
          repository: blokoRepository,
          success: blokoSuccess,
          failure: blokoFailure,
        };
      }
    }

    const payload = { foo: 'bar' };

    httpInstance[method].mockResolvedValue(payload);

    const bloko = createBloko(blokoDisplayName, Bloko);
    const action = bloko.actions.myAction(payload);

    const response = await action(contextMock);

    expect(httpInstance[method]).toHaveBeenCalledTimes(1);
    expect(httpInstance[method]).toHaveBeenCalledWith(endpoint);

    let startCommitPayload = contextMock.commit.mock.calls[0][0];
    let dataCommitPayload = contextMock.commit.mock.calls[1][0];
    let finishCommitPayload = contextMock.commit.mock.calls[2][0];

    expect(contextMock.commit).toHaveBeenCalledTimes(3);
    expect(startCommitPayload).toEqual({ [isLoadingName]: true });
    expect(finishCommitPayload).toEqual({ [isLoadingName]: false });
    expect(dataCommitPayload).toEqual(payload);
    expect(response).toEqual(payload);

    const errorMessage = 'errorMessage';

    contextMock.commit.mockClear();
    httpInstance[method].mockClear();
    httpInstance[method].mockRejectedValue(new Error(errorMessage));

    try {
      // action are rethrowing error
      await action(contextMock);
    } catch (error) {
      expect(httpInstance[method]).toHaveBeenCalledTimes(1);
      expect(httpInstance[method]).toHaveBeenCalledWith(endpoint);

      startCommitPayload = contextMock.commit.mock.calls[0][0];
      dataCommitPayload = contextMock.commit.mock.calls[1][0];
      finishCommitPayload = contextMock.commit.mock.calls[2][0];

      expect(contextMock.commit).toHaveBeenCalledTimes(3);
      expect(startCommitPayload).toEqual({ [isLoadingName]: true });
      expect(finishCommitPayload).toEqual({ [isLoadingName]: false });
      expect(dataCommitPayload).toEqual(error.message);

      expect(error.message).toEqual(errorMessage);
    }
  });
});
