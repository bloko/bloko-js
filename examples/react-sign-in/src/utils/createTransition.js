import { getModel } from './createModel';

function createTransition(config) {
  let _log = false;
  const funcNames = Object.keys(config);
  let handlers = {};

  funcNames.forEach(funcName => {
    const [inputName, ...outputNames] = config[funcName].match(/[^ {,}\->]+/g);

    handlers[funcName] = {
      inputName,
      outputNames,
      input: _getModel(inputName),
      outputs: outputNames.map(name => _getModel(name)),
    };
  });

  function _getModel(inputName) {
    const Model = getModel(inputName);

    Model.displayName = inputName;

    return Model;
  }

  function connect(repository) {
    const funcNames = Object.keys(repository);

    return funcNames.reduce((acc, funcName) => {
      const { input, outputs, outputNames } = handlers[funcName];

      acc[funcName] = async payload => {
        try {
        print('input', new input(payload));

        const InputModel = new input(payload);
        const inputJson = InputModel.toJSON();

        const result = await repository[funcName](inputJson);

        return outputs.reduce((acc, output, index) => {
          const key =
            outputNames[index].charAt(0).toLowerCase() +
            outputNames[index].slice(1);

          print('output', new output(result));

          const OutputModel = new output(result);
          const outputJson = OutputModel.toJSON();

          acc[key] = outputJson;

          return acc;
        }, {});
      } catch (error) {
        if (error.bloko) {
          print('error', error.bloko);
        }

        throw error;
      }
      };

      return acc;
    }, {});
  }

  function print(type, data) {
    if (_log) {
      console.log(`[${type.toUpperCase()}]`);
      console.log(data);
      console.log('\n');
    }
  }

  return {
    connect,
    of: connect,
    for: connect,
    log(value) {
      _log = value;
    },
  };
}

export default createTransition;