// jest.setup.ts
import '@testing-library/jest-dom';


// If using 'whatwg-fetch' or other polyfills for fetch API in tests, import them here.
//import 'whatwg-fetch';
import 'cross-fetch/polyfill'; // P
import { server } from '../EMS/src/mocks/server';


