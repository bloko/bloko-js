import Model from './Model';

const propName = 'prop';
const isRequired = {
  rule: function isRequired(v) {
    return !!v;
  },
  onError: 'Prop is Required',
};
const getModelRules = jest.fn(() => ({
  [propName]: [isRequired],
}));

class ModelTest extends Model {
  rules() {
    return getModelRules();
  }
}

ModelTest.displayName = 'ModelTest';

describe('Model', () => {
  it('should set exactly input through output', () => {
    const input = { [propName]: 'prop' };
    const instance = new ModelTest(input);
    const output = instance.toJSON();

    expect(output).toStrictEqual(output);
  });

  it('should check rules and on any failure throw an error when creating instance', () => {
    function fn() {
      new ModelTest();
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(`"Prop is Required"`);
  });

  it('should also check non array rules', () => {
    getModelRules.mockReturnValueOnce({
      [propName]: isRequired,
    });

    function fn() {
      new ModelTest();
    }

    expect(fn).toThrowErrorMatchingInlineSnapshot(`"Prop is Required"`);
  });

  it('should have error.bloko on exceptions', () => {
    try {
      new ModelTest();
    } catch (error) {
      expect(error.bloko).toEqual({
        model: ModelTest.displayName,
        ruleName: isRequired.rule.name,
        key: propName,
        value: undefined,
        message: expect.any(String),
      });

      expect(error.bloko.message).toMatchInlineSnapshot(
        `"Model ModelTest has invalid prop prop for rule isRequired (value: undefined)"`
      );
    }
  });
});
