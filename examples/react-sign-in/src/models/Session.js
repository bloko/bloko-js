import { Model } from '../utils/bloko';

class Session extends Model {
  constructor(props) {
    super(props);

    this.token = props.accessToken;
    this.ttl = props.ttl;
  }
}

export default Session;
