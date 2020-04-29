import combineModels from './combineModels';
import { models } from './utils/state';

describe('combineModels', () => {
  it('should correct save object models in models Map', () => {
    class U {}

    class T {}

    class V {}

    combineModels({ U, T, V });

    // I = Identity setted on test/setupTests
    expect(models.size).toEqual(4);
    expect(models.has('I')).toEqual(true);
    expect(models.has('U')).toEqual(true);
    expect(models.has('T')).toEqual(true);
    expect(models.has('V')).toEqual(true);

    models.delete('U');
    models.delete('T');
    models.delete('V');
  });
});