import { loggerPrefix } from '~utils/loggerPrefix';

export function logger(...args: any[]) {
  console.log.call(null, loggerPrefix, ...args);
}
