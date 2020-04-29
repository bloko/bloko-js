import getModel from './utils/getModel';

function createTransition(transitionString) {
  const [inputName, ...outputNames] = transitionString.match(/[^ {,}\->]+/g);

  const inputModel = getModelWithDisplayName(inputName);
  const outputModels = outputNames.map(name => getModelWithDisplayName(name));

  return {
    input(payload) {
      const json = getModelJSONFromPayload(inputModel, payload);

      return json;
    },
    output(payload) {
      if (outputModels.length === 1) {
        const outputModel = outputModels[0];

        const json = getModelJSONFromPayload(outputModel, payload);

        return json;
      }

      return outputModels.reduce((acc, outputModel, index) => {
        const key =
          outputNames[index].charAt(0).toLowerCase() +
          outputNames[index].slice(1);

        const json = getModelJSONFromPayload(outputModel, payload);

        acc[key] = json;

        return acc;
      }, {});
    },
  };
}

function getModelWithDisplayName(inputName) {
  const Model = getModel(inputName);

  Model.displayName = inputName;

  return Model;
}

function getModelJSONFromPayload(instance, payload) {
  const model = new instance(payload);
  const json = model.toJSON();

  return json;
}

export default createTransition;
