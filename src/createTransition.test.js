import createTransition from './createTransition';
import { models } from './getters/state';
import Model from './Model';

const initialNumber = 1;

beforeEach(setup);
afterEach(clear);

describe('createTransition', () => {
  it('should apply correct input and output models', () => {
    const payload = { number: initialNumber };
    const { input, output } = createTransition('Plus5 -> Plus10');

    const plus5output = { number: initialNumber + 5 };
    const plus10output = { number: initialNumber + 10 };

    expect(input(payload)).toEqual(plus5output);
    expect(output(payload)).toEqual(plus10output);
  });

  it('should apply correct array of output models', () => {
    const payload = { number: initialNumber };
    const { input, output } = createTransition('Plus5 -> {Plus10, Plus5}');

    const plus5output = { number: initialNumber + 5 };
    const plus10output = { number: initialNumber + 10 };

    expect(input(payload)).toEqual(plus5output);
    expect(output(payload)).toEqual({
      plus5: plus5output,
      plus10: plus10output,
    });
  });
});

function setup() {
  class Plus5 extends Model {
    constructor(props) {
      super(props);

      this.number = props.number;
    }

    toJSON() {
      const json = super.toJSON();

      json.number = json.number + 5;

      return json;
    }
  }

  class Plus10 extends Model {
    constructor(props) {
      super(props);

      this.number = props.number;
    }

    toJSON() {
      const json = super.toJSON();

      json.number = json.number + 10;

      return json;
    }
  }

  models.set('Plus5', Plus5);
  models.set('Plus10', Plus10);
}

function clear() {
  models.delete('Plus5');
  models.delete('Plus10');
}
