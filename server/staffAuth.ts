import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function createPasswordHash(password: string) {
  const passwordSalt = randomBytes(16).toString('hex');
  const passwordHash = (await derive(password, passwordSalt)).toString('hex');
  return { passwordSalt, passwordHash };
}

export async function verifyPassword(password: string, passwordSalt: string, passwordHash: string) {
  const expected = Buffer.from(passwordHash, 'hex');
  const actual = await derive(password, passwordSalt);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}