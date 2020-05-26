<p align="center">
  <a href="https://bloko.dev">
  <br />
  <img src="https://user-images.githubusercontent.com/7120471/80561131-d98be300-89b9-11ea-9956-679a406a387e.png" alt="Logo Bloko" height="60"/>
  <br />
    <sub><strong>Build modular applications with JavaScript</strong></sub>
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

## Packages

- 🧱`@bloko/js` - Core library and utilities to handle Blokos
- [⚛️`@bloko/react`](https://github.com/bloko/bloko-react) - React hooks and utilities for using Bloko in React applications

Bloko is currently under heavy development, but can be installed by running:

```sh
npm install --save @bloko/js
```

## Blokos Unit

Blokos Unit are the smaller of Blokos. Using these Blokos you can describe the application's Entities.

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

Blokos Unit can allow you to create derivated data from other props.

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
  },
});

User();
// => { name: '',  surname: '', fullName: '' }

User({ name: 'John', surname: 'S.' });
// => { name: 'John',  surname: 'S.', fullName: 'John S.' }
```

### Rules and Transformations

Blokos Unit can check prop rules and do transformations when needed.

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

      return surname.toUpperCase();
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

User({ name: 'John', surname: 'Smith' });
// => { name: 'John',  surname: 'SMITH' }

// You could check a raw object following User rules
User.validate({ name: '' });
// => false
User.validate({ name: 'John', surname: 'S.' });
// => true

// You could get rules array of each prop and apply wherever you need
User.rules();
// => { name: [isRequiredRule, isSmallRule], surname: [isRequiredRule] }
```

### Initial State

Blokos Unit can return initial state from default values.

```js
import Bloko from '@bloko/js';

const User = Bloko.create({
  name: '',
  surname: {
    value: '',
    rules: [],
  },
  noDefault: {
    rules: [],
  },
  derivated() {
    return '';
  },
});

// Note that state() won't return derivated props
User.state();
// => { name: '',  surname: '', noDefault: undefined }
```

### Composition between Blokos Unit

Blokos Unit can be more complex and compose other Blokos Unit and check children rules directly from parent.

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

## Blokos Store

Blokos Store are the next important Bloko. Using these Blokos you can describe how application's global state will behave based on its actions.

### A brief example

```js
import Bloko from '@bloko/js';

const Session = Bloko.create({
  token: '',
});

const Auth = Bloko.createStore({
  key: 'auth',
  state: {
    session: {
      type: Session,
      setters: true,
    },
  },
  actions: {
    signIn: {
      // Use loading function when it is
      // necessary to return something
      // different than true
      loading(payload) {
        return payload.email;
      },
      request(payload) {
        // Using axios to exmplify, but could be any provider
        return axios.post('/auth/sign-in', {
          email: payload.email,
          password: payload.password,
        });
      },
      resolved(data, state) {
        return {
          session: {
            ...state.session,
            token: data.token,
          },
        };
      },
    },
  },
});
```

`Auth` will store all its actions and current state on application's global state and could be accessed by its key `auth`. Besides `Auth` session state, a special state named `signIn` will automatically be created because `Auth` has an action with this name. `signIn` state will follow an object with shape `{ loading, error }` so on every `signIn` action call could be possible to track loading states and error feedback.

Blokos Store needs a context to work and specific bloko libraries like [`bloko-react`](https://github.com/bloko/bloko-react) will give it using [`Bloko.Provider`](https://github.com/bloko/bloko-react#bloko-provider).

When you call `signIn` with its necessary payload `loading` will be called and its changes loading request state and reset any errors to empty string. Using `loading` function it could be possible to return something different than true.

Next `repository` handler will be called. The example above will fire a http request simulating an authentication flow.

When it is finished and has a green response, `resolved` handler will be called and it is responsible to return the next state based on resolved data passed as first parameter. Given the example, session will be updated with a new token in `data.token`.

When `repository` rejects something a internal catch handles the error and updates `signIn.error` state with `error.message` string.

Special actions are created automatically when are using `setters: true`. Actions follow a prefix `set` or `reset` like `actions.setSession` and `actions.resetSession` and they are responsible to manipulate `session` state for needed cases.

## Why?

...
