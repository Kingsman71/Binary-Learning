// cleanup-applications.js
// Run this script with: node cleanup-applications.js
// This will delete application documents that do not have a valid studentId (i.e., not migrated)

const admin = require('firebase-admin');
// REMOVE: Do not commit serviceAccountKey.json to public repos. Use environment variables or secret manager in production.
// const serviceAccount = require('./serviceAccountKey.json');
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) : undefined;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanupApplications() {
  const appsSnap = await db.collection('applications').get();
  let deleted = 0;
  for (const doc of appsSnap.docs) {
    const appData = doc.data();
    if (!appData.studentId) {
      await doc.ref.delete();
      console.log(`Deleted application ${doc.id} (no studentId)`);
      deleted++;
    }
  }
  console.log(`Cleanup complete. Deleted ${deleted} applications.`);
}

cleanupApplications().catch(console.error);
