import { Model } from '../utils/bloko';

class UserForm extends Model {
  constructor(props) {
    super(props);

    this.email = props.email;
    this.password = props.password;
  }

  rules() {
    return {
      email: [
        {
          rule: 'isRequired',
          onError: 'E-mail é obrigatório',
        },
        {
          rule: 'isEmail',
          onError: 'E-mail não é válido'
        }
      ],
      password: [
        {
          rule: 'isRequired',
          onError: 'Senha é obrigatória',
        },
        {
          rule: 'isMoreThan.3',
          onError: 'Informe uma senha com no mínimo 3 caracteres'
        }
      ],
    };
  }

  toJSON() {
    const json = super.toJSON();

    this.validate(json);

    return json;
  }
}

export default UserForm;
