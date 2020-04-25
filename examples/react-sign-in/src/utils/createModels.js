import createModel from './createModel';

function createModels(models) {
  Object.keys(models).forEach(modelName => {
    createModel(modelName, models[modelName]);
  });
}

export default createModels;
