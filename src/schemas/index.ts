// To help typescript find the type
import { mainSchemas } from './main/index';
import { rinkebySchemas } from './rinkeby/index';

export const schemas = {
  rinkeby: rinkebySchemas,
  main: mainSchemas,
};
