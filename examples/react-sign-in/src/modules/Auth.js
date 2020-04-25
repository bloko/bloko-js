import Bloko from '../utils/bloko';

const Transition = Bloko.createTransition({
  signIn: 'UserForm -> {User, Session}',
});

Transition.log(false);

const Repository = Bloko.createRepository({
  signIn: 'POST /auth/login',
  signOut: 'POST /auth/logout',
  register: 'POST /auth/register',
});

export default Transition.for(Repository);
