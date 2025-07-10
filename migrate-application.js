// migrate-application.js
// Run this script with: node migrate-application.js
// Make sure you have Firebase Admin SDK installed: npm install firebase-admin

const admin = require('firebase-admin');
// REMOVE: Do not commit serviceAccountKey.json to public repos. Use environment variables or secret manager in production.
// const serviceAccount = require('./serviceAccountKey.json');
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) : undefined;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateApplications() {
  const appsSnap = await db.collection('applications').get();
  for (const doc of appsSnap.docs) {
    const appData = doc.data();
    const email = appData.applicant?.email;
    if (!email) {
      console.log(`Skipping application ${doc.id}: no applicant email`);
      continue;
    }
    // Find student by email
    const studentsSnap = await db.collection('students').where('email', '==', email).get();
    if (!studentsSnap.empty) {
      const studentDoc = studentsSnap.docs[0];
      const studentId = studentDoc.data().uid;
      await doc.ref.update({ studentId });
      console.log(`Updated application ${doc.id} with studentId ${studentId}`);
    } else {
      console.log(`No student found for email ${email} (application ${doc.id})`);
    }
  }
  console.log('Migration complete.');
}

migrateApplications().catch(console.error);
