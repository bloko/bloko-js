import './http-mock';
import Identity from '../src/utils/Identity';
import { models } from '../src/utils/state';

// necessary for default transition 'I -> I'
models.set('I', Identity);
