import createUnit from './createUnit';

describe('createUnit', () => {
  it('should handle default values', () => {
    const defaultString = '';
    const defaultInt = 1;

    const Bloko = createUnit({
      name: defaultInt,
    });

    const BlokoExplicit = createUnit({
      name: {
        value: defaultString,
      },
    });

    expect(Bloko()).toEqual({ name: defaultInt });
    expect(BlokoExplicit()).toEqual({ name: defaultString });
  });

  it('should handle default values as array', () => {
    const Bloko = createUnit({
      name: 'child1',
    });

    expect(Bloko.Array()).toEqual([]);
    expect(Bloko.Array({ name: undefined })).toEqual([{ name: 'child1' }]);
    expect(Bloko.Array([{ name: 'name' }])).toEqual([{ name: 'name' }]);
  });

  it('should handle descriptor with default values and handlers', () => {
    function capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    const Bloko = createUnit({
      name: {
        value(name) {
          return name ? capitalize(name) : '';
        },
      },
    });

    expect(Bloko()).toEqual({ name: '' });
    expect(Bloko({ name: 'name' })).toEqual({ name: 'Name' });
  });

  it('should handle derivated props', () => {
    const Bloko = createUnit({
      firstName: '',
      lastName: {
        value(lastName) {
          return lastName ? lastName.toUpperCase() : '';
        },
      },
      fullName() {
        if (!this.firstName || !this.lastName) {
          return '';
        }

        return this.firstName + ' ' + this.lastName;
      },
    });

    const data = {
      firstName: 'foo',
      lastName: 'bar',
    };

    const expected = {
      ...data,
      lastName: data.lastName.toUpperCase(),
      fullName: data.firstName + ' ' + data.lastName.toUpperCase(),
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

    const BlokoOneRule = createUnit({
      name: {
        rules: rules[0],
      },
    });

    const BlokoTwoRules = createUnit({
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

    const Bloko = createUnit({
      name: {
        value(name) {
          return name ? capitalize(name) : '';
        },
        rules: [
          v => !!v || requiredMessage,
          v => v.length >= 4 || smallMessage,
        ],
      },
    });

    const bloko = Bloko();

    expect(bloko).toEqual({ name: '' });

    bloko.name = 'name';

    expect(bloko).toEqual({ name: 'Name' });
    expect(() => Bloko({ name: '' })).toThrowError(requiredMessage);
    expect(() => Bloko({ name: 'n' })).toThrowError(smallMessage);
  });

  it('should validate input data with Bloko.validation', () => {
    const requiredMessage = 'Name is required';

    const Bloko = createUnit({
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

    const Bloko = createUnit({
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

  it('should get rules swith Bloko.rules', () => {
    const isRequiredRule = v => !!v || 'Name is required';

    const Bloko = createUnit({
      name: {
        value: '',
        rules: isRequiredRule,
      },
      child: createUnit({
        childName: {
          value: 'childName',
          rules: isRequiredRule,
        },
      }),
    });

    expect(Bloko.rules).toEqual({
      name: [isRequiredRule],
      child: {
        childName: [isRequiredRule],
      },
    });
  });

  it('should handle inheritance between unit blokos', () => {
    const ChildOne = createUnit({
      name: 'child1',
    });

    const ChildTwo = createUnit({
      name: 'child2',
      id: 1,
    });

    const ChildThree = createUnit({
      name: 'child3',
      derivated() {
        return this.name;
      },
      childTwo: ChildTwo.Array,
    });

    const Parent = createUnit({
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
        derivated: 'child3',
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
        derivated: 'child3',
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
