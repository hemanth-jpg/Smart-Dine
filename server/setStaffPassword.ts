import { config } from 'dotenv';
import { createInterface } from 'node:readline/promises';
import { MongoClient } from 'mongodb';
import { STAFF_ACCOUNTS } from '../src/data/staffAccounts';
import { createPasswordHash } from './staffAuth';

config({ path: ['.env.local', '.env'] });

function readHidden(prompt: string): Promise<string> {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    return Promise.reject(new Error('Run this command in an interactive terminal.'));
  }

  process.stdout.write(prompt);
  const wasRaw = process.stdin.isRaw;
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve, reject) => {
    let value = '';
    const cleanup = () => {
      process.stdin.removeListener('data', onData);
      process.stdin.setRawMode(wasRaw);
      process.stdin.pause();
      process.stdout.write('\n');
    };
    const onData = (chunk: Buffer) => {
      for (const character of chunk.toString()) {
        if (character === '\u0003') {
          cleanup();
          reject(new Error('Password entry canceled.'));
          return;
        }
        if (character === '\r' || character === '\n') {
          cleanup();
          resolve(value);
          return;
        }
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
          process.stdout.write('\b \b');
        } else if (character >= ' ') {
          value += character;
          process.stdout.write('*');
        }
      }
    };
    process.stdin.on('data', onData);
  });
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required in .env.local or .env.');

  const input = createInterface({ input: process.stdin, output: process.stdout });
  const id = (await input.question(`Staff ID (${Object.values(STAFF_ACCOUNTS).map((account) => account.id).join(', ')}): `))
    .trim()
    .toUpperCase();
  input.close();

  const account = Object.values(STAFF_ACCOUNTS).find((candidate) => candidate.id === id);
  if (!account) throw new Error('Unknown staff ID. Choose one of the listed demo IDs.');

  const password = await readHidden('New password (minimum 12 characters): ');
  if (password.length < 12) throw new Error('Password must contain at least 12 characters.');
  const passwordHash = await createPasswordHash(password);

  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const collection = client.db(process.env.MONGODB_DATABASE || 'smart_dine').collection('staff_accounts');
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.updateOne(
      { id: account.id },
      {
        $set: { ...account, ...passwordHash, passwordConfigured: true, updatedAt: new Date() },
      },
      { upsert: true },
    );
    console.log(`Password saved for ${account.id}. Only its salted hash is stored in MongoDB.`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Unable to set staff password.');
  process.exitCode = 1;
});