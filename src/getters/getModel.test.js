import getModel from './getModel';
import { models } from './state';

const modelName = 'ModelMock';

class ModelMock {}

ModelMock.displayName = 'ClassDisplayName';

describe('getModel', () => {
  it('should throw an error when model cannot be found', () => {
    function fn() {
      getModel(modelName);
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(
      `"Model ModelMock cannot be found."`
    );
  });

  it('should match correct model', () => {
    models.set(modelName, ModelMock);

    const Model = getModel(modelName);

    expect(Model.displayName).toEqual(ModelMock.displayName);

    models.delete(modelName);
  });
});
