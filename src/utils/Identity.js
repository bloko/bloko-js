import Model from './Model';

class Identity extends Model {
  constructor(props = {}) {
    super(props);

    Object.keys(props).forEach(propName => {
      this[propName] = props[propName];
    });
  }
}

export default Identity;
