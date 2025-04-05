// generateCollections.ts
const { MongoClient } = require('mongodb');
const { writeFileSync } = require('fs');
const { config } = require('dotenv');
const { exit } = require('process');

// Load environment variables
config();

// Get connection string from environment
const MONGODB_URI = process.env.DATABASE_URL_DEV;
const DB_NAME = process.env.DB_NAME || 'test';
const OUTPUT_FILE = './dbCollections.ts';

if (!MONGODB_URI) {
  console.error('Error: DATABASE_URL_DEV not found in .env file');
  exit(1);
}

async function generateCollectionTypes() {
  let client;

  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 50000,
      serverSelectionTimeoutMS: 50000,
    });

    await client.connect();

    console.log('Fetching collections...');
    const db = client.db(DB_NAME);
    const collections = await db.listCollections().toArray();

    const collectionNames = collections
      .map((c) => c.name)
      .filter((name) => !name.startsWith('system.'))
      .sort();

    if (collectionNames.length === 0) {
      console.warn('Warning: No collections found in database');
    }

    // Generate the type and values in proper TypeScript syntax
    const typeDefinition = `// Auto-generated at ${new Date().toISOString()}
// DO NOT EDIT THIS FILE MANUALLY

export type MongoDBCollections = 
  | '${collectionNames.join("'\n  | '")}';

export const collectionValues = [
  '${collectionNames.join("',\n  '")}'
] as const;

export type CollectionValues = typeof collectionValues[number];
`;

    writeFileSync(OUTPUT_FILE, typeDefinition);
    console.log(
      `✓ Successfully wrote ${collectionNames.length} collections to ${OUTPUT_FILE}`
    );
  } catch (error) {
    console.error('WRITING COLLECTIONS ERROR:', error.message);
    console.error('Ensure:');
    console.error('1. MongoDB is running');
    console.error('2. Your DATABASE_URL_DEV in .env is correct');
    console.error('3. You have network access to the database');
    exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

generateCollectionTypes();
