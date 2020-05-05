import createUnitBloko from './createUnitBloko';

describe('createUnitBloko', () => {
  it('should handle default values', () => {
    const defaultString = '';
    const defaultInt = 1;

    const Bloko = createUnitBloko({
      name: defaultInt,
    });

    const BlokoExplicit = createUnitBloko({
      name: {
        value: defaultString,
      },
    });

    expect(Bloko()).toEqual({ name: defaultInt });
    expect(BlokoExplicit()).toEqual({ name: defaultString });
  });

  it('should handle default values as array', () => {
    const Bloko = createUnitBloko({
      name: 'child1',
    });

    expect(Bloko.Array()).toEqual([]);
    expect(Bloko.Array({ name: undefined })).toEqual([{ name: 'child1' }]);
    expect(Bloko.Array([{ name: 'name' }])).toEqual([{ name: 'name' }]);
  });

  it('should handle descriptor with default values and handlers', () => {
    function capitalize(value) {
      if (typeof value !== 'string') {
        return value;
      }

      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    const Bloko = createUnitBloko({
      name: capitalize,
    });

    const BlokoExplicit = createUnitBloko({
      name: {
        value: '',
        handler: capitalize,
      },
    });

    expect(Bloko()).toEqual({ name: undefined });
    expect(Bloko({ name: 'name' })).toEqual({ name: 'Name' });
    expect(BlokoExplicit()).toEqual({ name: '' });
    expect(BlokoExplicit({ name: 'name' })).toEqual({ name: 'Name' });
  });

  it('should handle aggregate props', () => {
    const Bloko = createUnitBloko({
      firstName: '',
      lastName: '',
      fullName(_, data) {
        if (!data) {
          return '';
        }

        return data.firstName + ' ' + data.lastName;
      },
    });

    const data = {
      firstName: 'foo',
      lastName: 'bar',
    };

    const expected = {
      ...data,
      fullName: data.firstName + ' ' + data.lastName,
    };

    expect(Bloko(data)).toEqual(expected);
  });

  it('should handle function or array function of rules', () => {
    const requiredMessage = 'Name is required';
    const smallMessage = 'Name is small';

    const rules = [
      v => !!v || requiredMessage,
      v => v.length >= 4 || smallMessage,
    ];

    const BlokoOneRule = createUnitBloko({
      name: {
        rules: rules[0],
      },
    });

    const BlokoTwoRules = createUnitBloko({
      name: {
        rules,
      },
    });

    expect(BlokoOneRule()).toEqual({ name: undefined });
    expect(BlokoTwoRules()).toEqual({ name: undefined });
    expect(BlokoOneRule({ name: 'n' })).toEqual({ name: 'n' });
    expect(() => BlokoOneRule({ name: '' })).toThrowError(requiredMessage);
    expect(() => BlokoTwoRules({ name: '' })).toThrowError(requiredMessage);
    expect(() => BlokoTwoRules({ name: 'n' })).toThrowError(smallMessage);
  });

  it('should handle descriptor with default values, handlers and rules', () => {
    function capitalize(value) {
      if (typeof value !== 'string') {
        return value;
      }

      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    const requiredMessage = 'Name is required';
    const smallMessage = 'Name is small';

    const Bloko = createUnitBloko({
      name: {
        value: '',
        handler: capitalize,
        rules: [
          v => !!v || requiredMessage,
          v => v.length >= 4 || smallMessage,
        ],
      },
    });

    expect(Bloko()).toEqual({ name: '' });
    expect(Bloko({ name: 'name' })).toEqual({ name: 'Name' });
    expect(() => Bloko({ name: '' })).toThrowError(requiredMessage);
    expect(() => Bloko({ name: 'n' })).toThrowError(smallMessage);
  });

  it('should validate input data with Bloko.validation', () => {
    const requiredMessage = 'Name is required';

    const Bloko = createUnitBloko({
      name: {
        value: '',
        rules: v => !!v || requiredMessage,
      },
    });

    const bloko = Bloko();

    bloko.name = 'name';

    expect(Bloko.validate(bloko)).toEqual(true);

    bloko.name = '';

    expect(Bloko.validate(bloko)).toEqual(false);
  });

  it('should validate input array data with Bloko.validation', () => {
    const requiredMessage = 'Name is required';

    const Bloko = createUnitBloko({
      name: {
        value: '',
        rules: v => !!v || requiredMessage,
      },
    });

    const bloko = Bloko();

    bloko.name = 'name';

    expect(Bloko.Array.validate([bloko])).toEqual(true);
    expect(Bloko.Array.validate(bloko)).toEqual(true);

    bloko.name = '';

    expect(Bloko.Array.validate([bloko])).toEqual(false);
    expect(Bloko.Array.validate(bloko)).toEqual(false);
  });

  it('should only get rules from its Unit Bloko with Bloko.rules', () => {
    const isRequiredRule = v => !!v || 'Name is required';

    const Bloko = createUnitBloko({
      name: {
        value: '',
        rules: isRequiredRule,
      },
      child: createUnitBloko({
        childName: {
          value: 'childName',
          rules: isRequiredRule,
        },
      }),
    });

    expect(Bloko.rules).toEqual({
      name: [isRequiredRule],
    });
  });

  it('should handle inheritance between unit blokos', () => {
    const ChildOne = createUnitBloko({
      name: 'child1',
    });

    const ChildTwo = createUnitBloko({
      name: 'child2',
      id: 1,
    });

    const ChildThree = createUnitBloko({
      name: 'child3',
      childTwo: ChildTwo.Array,
    });

    const Parent = createUnitBloko({
      name: 'parent',
      childOne: ChildOne,
      childThree: ChildThree,
    });

    expect(Parent()).toEqual({
      name: 'parent',
      childOne: {
        name: 'child1',
      },
      childThree: {
        name: 'child3',
        childTwo: [],
      },
    });

    expect(Parent()).toEqual({
      name: 'parent',
      childOne: {
        name: 'child1',
      },
      childThree: {
        name: 'child3',
        childTwo: [],
      },
    });

    expect(Parent({ childThree: { childTwo: [{ name: 'test' }] } })).toEqual({
      name: 'parent',
      childOne: {
        name: 'child1',
      },
      childThree: {
        name: 'child3',
        childTwo: [
          {
            name: 'test',
            id: 1,
          },
        ],
      },
    });
  });
});
