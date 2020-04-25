import { Model } from '../utils/bloko';

class User extends Model {
  constructor(props) {
    super(props);

    this.name = props.name;
    this.email = props.email;
    this.avatar = props.avatar;
  }
}

export default User;
