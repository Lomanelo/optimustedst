import admin from 'firebase-admin';

function getServiceAccountFromEnv():
  | { projectId: string; clientEmail: string; privateKey: string }
  | null {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      const parsed = JSON.parse(json);
      if (parsed.project_id && parsed.client_email && parsed.private_key) {
        return {
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key
        };
      }
    } catch {
      // ignore
    }
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (privateKey) privateKey = privateKey.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }
  return null;
}

export function getAdminApp() {
  if (admin.apps.length) return admin.app();

  const sa = getServiceAccountFromEnv();
  if (!sa) {
    throw new Error(
      'Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_ADMIN_PROJECT_ID/FIREBASE_ADMIN_CLIENT_EMAIL/FIREBASE_ADMIN_PRIVATE_KEY.'
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: sa.projectId,
      clientEmail: sa.clientEmail,
      privateKey: sa.privateKey
    })
  });

  return admin.app();
}

export function getAdminFirestore() {
  return getAdminApp().firestore();
}

export function getAdminAuth() {
  return getAdminApp().auth();
}


