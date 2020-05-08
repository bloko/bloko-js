<p align="center">
  <a href="https://bloko.dev">
  <br />
  <img src="https://user-images.githubusercontent.com/7120471/80561131-d98be300-89b9-11ea-9956-679a406a387e.png" alt="Logo Bloko" height="60"/>
  <br />
    <sub><strong>Build modular applications with JavaScript</strong></sub>
  <br />
  <br />
  <br />
  <br />
  </a>
</p>


[![Travis build][travis-image]][travis-url]
[![Codecov coverage][codecov-image]][codecov-url]
[![NPM version][npm-image]][npm-url]

[codecov-url]: https://codecov.io/gh/bloko/bloko-js
[codecov-image]: https://codecov.io/gh/bloko/bloko-js/branch/master/graphs/badge.svg
[travis-image]: https://img.shields.io/travis/com/bloko/bloko-js.svg?branch=master
[travis-url]: https://img.shields.io/travis/com/bloko/bloko-js
[npm-url]: https://npmjs.com/package/@bloko/js
[npm-image]: https://img.shields.io/npm/v/@bloko/js.svg

Bloko is currently under heavy development, but can be installed by running:

```sh
npm install --save @bloko/js
```

## Unit Blokos

Unit Blokos are the smaller of Blokos. Using these Blokos you can describe the application's Entities.

### A quick example

```js
import Bloko from '@bloko/js';

const User = Bloko.create({
  name: '',
  surname: '',
});

User();
// => { name: '', surname: '' }

User({ name: 'John' });
// => { name: 'John', surname: '' }
```

### Derivated props

Unit Blokos can allow you create derivated data from other props.

```js
import Bloko from '@bloko/js';

const User = Bloko.create({
  name: '',
  surname: '',
  fullName() {
    if (!this.name || !this.surname) {
      return '';
    }

    return this.name + ' ' + this.surname;
  }
});

User();
// => { name: '',  surname: '', fullName: '' }

User({ firstName: 'John', lastName: 'S.' });
// => { name: 'John',  surname: 'S.', fullName: 'John S.' }
```

### Rules and Transformations

Unit Blokos can check prop rules and do transformations when needed.

```js
import Bloko from '@bloko/js';

const User = Bloko.create({
  name: {
    value: '',
    rules: [
      v => !!v || 'Name is required',
      v => v.length > 1 || 'Name is too small',
    ],
  },
  surname: {
    value(surname) {
      if (!surname) {
        return '';
      }

      return surname.toUpperCase(),
    },
    rules: v => !!v || 'Surname is required',
  },
});

// When entry is undefined, User will make a valid
// Bloko with default values and apply its transforms
User();
// => { name: '',  surname: '' }

// When entry is a object, User will run transformations
// and apply rules using fail fast strategy.
User({ name: '' });
// => Error: Name is required

// You could check a raw object following User rules
User.validate({ name: '' });
// => false
User.validate({ name: 'John', surname: 'S.' });
// => true
```

### Composition between Unit Blokos

Unit Blokos can be more complex and compose other Unit Blokos and check children rules directly from parent.

```js
import Bloko from '@bloko/js';

const Address = Bloko.create({
  zipcode: {
    value: '',
    rules: v => !!v || 'Zipcode is required',
  },
});

const User = Bloko.create({
  name: {
    value: '',
    rules: v => !!v || 'Name is required',
  },
  address: Address,
});

User();
// => { name: '', address: { zipcode: '' } }

User({ name: 'John' });
// => Error: Zipcode is required

User({ name: 'John', address: { zipcode: '84275' } });
// => { name: 'John', address: { zipcode: '84275' } }
```

## Store Bloko

Store Blokos are the next important Bloko. Using these Blokos you can describe how application's global state will behave based on its actions.

### A brief example

```js
import Bloko from '@bloko/js';

const Session = Bloko.create({
  token: '',
});

const Auth = Bloko.createStore({
  key: 'auth',
  state: {
    session: Session,
  },
  actions: {
    signIn: {
      repository(payload) {
        return http.post('/auth/sign-in', {
          email: payload.email,
          password: payload.password,
        });
      },
      resolved(data) {
        return {
          session: {
            token: data.token,
          },
        };
      },
    }
  }
});
```

`Auth` will store all its actions and current state on application's global state and could be accessed by its key `auth`.

Store Blokos needs a context to work and specific bloko libraries like [bloko-react](https://github.com/bloko/bloko-react) will give it.

When you call `signIn` with its necessary payload `repository` handler will be called. The example above will fire a http request simulating an authentication flow. When it is finished and has a green response, `resolved` handler will be called and must return a full or partial state to update its current Store state. Given the example, session will be updated with a new token in `data.token`.

## Why?

...
