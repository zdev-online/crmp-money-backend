import { createHash } from 'crypto';

export const md5 = (string: string) =>
  createHash('md5').update(string).digest('hex');
