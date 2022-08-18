import { logger } from '@libs/utils';
import { generateId } from '~core/generateId';

export function coreMethod() {
  const id = generateId();
  logger('core method, id:', id);
}
