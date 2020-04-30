import createBloko from './createBloko';
import { models } from './getters/state';
import http from './http';
import Model from './Model';

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

beforeEach(() => {
  contextMock.commit.mockClear();
  httpInstance[method].mockClear();
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

  it('should throw an interface error for repository', () => {
    class Bloko {
      myAction() {
        return {};
      }
    }

    function fn() {
      createBloko(blokoDisplayName, Bloko);
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"[Bloko]: action myAction must implement repository as a string or function"`
    );
  });

  it('should throw an interface error for repository type value', () => {
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
      `"[Bloko]: action myAction must implement repository as a string or function"`
    );
  });

  it('should throw an interface error for success', () => {
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
      `"[Bloko]: action myAction must implement success as a function"`
    );
  });

  it('should throw when using transition.input as a string', () => {
    class Bloko {
      myAction() {
        return {
          repository: blokoRepository,
          transition: {
            input: 'input',
          },
          success: blokoSuccess,
        };
      }
    }

    function fn() {
      createBloko(blokoDisplayName, Bloko);
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"[Bloko]: action myAction must implement transition.input as a function"`
    );
  });

  it('should throw when using transition.ouput as a string', () => {
    class Bloko {
      myAction() {
        return {
          repository: blokoRepository,
          transition: {
            output: 'output',
          },
          success: blokoSuccess,
        };
      }
    }

    function fn() {
      createBloko(blokoDisplayName, Bloko);
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"[Bloko]: action myAction must implement transition.output as a function"`
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

  it('should not throw when using repository as a function', () => {
    class Bloko {
      myAction() {
        return {
          repository: () => Promise.resolve({}),
          success: blokoSuccess,
        };
      }
    }

    function fn() {
      createBloko(blokoDisplayName, Bloko);
    }

    expect(fn).not.toThrow();
  });

  it('should not throw when using transition as a object', () => {
    class Bloko {
      myAction() {
        return {
          repository: blokoRepository,
          transition: {},
          success: blokoSuccess,
        };
      }
    }

    function fn() {
      createBloko(blokoDisplayName, Bloko);
    }

    expect(fn).not.toThrow();
  });

  it('should handle repository, transition, success and failure', async () => {
    const actionName = 'myAction';
    const isLoadingName =
      'isLoading' + (actionName.charAt(0).toUpperCase() + actionName.slice(1));
    const defaultNameValue = '';
    const IdentityDisplayName = 'I';

    class Identity extends Model {
      constructor(props) {
        super(props);

        Object.keys(props).forEach(propName => {
          this[propName] = props[propName] || defaultNameValue;
        });
      }
    }

    models.set(IdentityDisplayName, Identity);

    class Bloko {
      static initialState() {
        return {
          [IdentityDisplayName]: IdentityDisplayName,
        };
      }

      [actionName]() {
        return {
          repository: blokoRepository,
          transition: `${IdentityDisplayName} -> ${IdentityDisplayName}`,
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

      models.delete(IdentityDisplayName);
    }
  });

  it('should handle repository, success, failure and Input transition as a function', async () => {
    const actionName = 'myAction';
    const isLoadingName =
      'isLoading' + (actionName.charAt(0).toUpperCase() + actionName.slice(1));
    const payload = { foo: 'bar' };
    const requestOptions = {};
    const payloadAfterInputTransition = { foo: 'barbar' };

    const repositoryFn = jest.fn(payload => Promise.resolve(payload));
    const transitionFn = {
      input: jest.fn(() => payloadAfterInputTransition),
    };

    class Bloko {
      [actionName]() {
        return {
          repository: repositoryFn,
          transition: transitionFn,
          success: blokoSuccess,
          failure: blokoFailure,
        };
      }
    }

    const bloko = createBloko(blokoDisplayName, Bloko);
    const action = bloko.actions.myAction(payload);

    const response = await action(contextMock, requestOptions);

    expect(repositoryFn).toHaveBeenCalledTimes(1);
    expect(repositoryFn).toHaveBeenCalledWith(
      payloadAfterInputTransition,
      requestOptions
    );

    let startCommitPayload = contextMock.commit.mock.calls[0][0];
    let dataCommitPayload = contextMock.commit.mock.calls[1][0];
    let finishCommitPayload = contextMock.commit.mock.calls[2][0];

    expect(contextMock.commit).toHaveBeenCalledTimes(3);
    expect(startCommitPayload).toEqual({ [isLoadingName]: true });
    expect(finishCommitPayload).toEqual({ [isLoadingName]: false });
    expect(dataCommitPayload).toEqual(payloadAfterInputTransition);
    expect(response).toEqual(payloadAfterInputTransition);
  });

  it('should handle repository, success, failure and Output transition as a function', async () => {
    const actionName = 'myAction';
    const isLoadingName =
      'isLoading' + (actionName.charAt(0).toUpperCase() + actionName.slice(1));
    const payload = { foo: 'bar' };
    const requestOptions = {};
    const payloadAfterOutputTransition = { foo: 'barbar' };

    const repositoryFn = jest.fn(payload => Promise.resolve(payload));
    const transitionFn = {
      output: jest.fn(() => payloadAfterOutputTransition),
    };

    class Bloko {
      [actionName]() {
        return {
          repository: repositoryFn,
          transition: transitionFn,
          success: blokoSuccess,
          failure: blokoFailure,
        };
      }
    }

    const bloko = createBloko(blokoDisplayName, Bloko);
    const action = bloko.actions.myAction(payload);

    const response = await action(contextMock, requestOptions);

    expect(repositoryFn).toHaveBeenCalledTimes(1);
    expect(repositoryFn).toHaveBeenCalledWith(payload, requestOptions);

    let startCommitPayload = contextMock.commit.mock.calls[0][0];
    let dataCommitPayload = contextMock.commit.mock.calls[1][0];
    let finishCommitPayload = contextMock.commit.mock.calls[2][0];

    expect(contextMock.commit).toHaveBeenCalledTimes(3);
    expect(startCommitPayload).toEqual({ [isLoadingName]: true });
    expect(finishCommitPayload).toEqual({ [isLoadingName]: false });
    expect(dataCommitPayload).toEqual(payloadAfterOutputTransition);
    expect(response).toEqual(payloadAfterOutputTransition);
  });

  it('should handle repository, success, failure and Input and Output transition as a function', async () => {
    const actionName = 'myAction';
    const isLoadingName =
      'isLoading' + (actionName.charAt(0).toUpperCase() + actionName.slice(1));
    const payload = { foo: 'bar' };
    const requestOptions = {};
    const payloadAfterInputTransition = { foo: 'barbar' };
    const payloadAfterOutputTransition = { foo: 'barbarbar' };

    const repositoryFn = jest.fn(payload => Promise.resolve(payload));
    const transitionFn = {
      input: jest.fn(() => payloadAfterInputTransition),
      output: jest.fn(() => payloadAfterOutputTransition),
    };

    class Bloko {
      [actionName]() {
        return {
          repository: repositoryFn,
          transition: transitionFn,
          success: blokoSuccess,
          failure: blokoFailure,
        };
      }
    }

    const bloko = createBloko(blokoDisplayName, Bloko);
    const action = bloko.actions.myAction(payload);

    const response = await action(contextMock, requestOptions);

    expect(repositoryFn).toHaveBeenCalledTimes(1);
    expect(repositoryFn).toHaveBeenCalledWith(
      payloadAfterInputTransition,
      requestOptions
    );

    let startCommitPayload = contextMock.commit.mock.calls[0][0];
    let dataCommitPayload = contextMock.commit.mock.calls[1][0];
    let finishCommitPayload = contextMock.commit.mock.calls[2][0];

    expect(contextMock.commit).toHaveBeenCalledTimes(3);
    expect(startCommitPayload).toEqual({ [isLoadingName]: true });
    expect(finishCommitPayload).toEqual({ [isLoadingName]: false });
    expect(dataCommitPayload).toEqual(payloadAfterOutputTransition);
    expect(response).toEqual(payloadAfterOutputTransition);
  });
});
