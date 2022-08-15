import { logger } from '@libs/utils';
import { generateId } from '~/generateId';

export function coreMethod() {
  const id = generateId();
  logger('core method, id:', id);
}
