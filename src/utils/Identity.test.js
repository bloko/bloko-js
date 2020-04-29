import Identity from './Identity';
import Model from './Model';

describe('Identity', () => {
  it('should be an instance of Model', () => {
    const instance = new Identity();

    expect(instance instanceof Model).toEqual(true);
  });

  it('should set exactly input through output', () => {
    const input = { foo: 'bar', xpto: 'xpto' };
    const instance = new Identity(input);
    const output = instance.toJSON();

    expect(output).toStrictEqual(output);
  });
});
