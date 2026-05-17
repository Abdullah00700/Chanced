import * as admin from "firebase-admin";

let _initialized = false;

export function getAdminApp(): admin.app.App {
  if (!_initialized) {
    const serviceAccountJson = process.env["FIREBASE_SERVICE_ACCOUNT_JSON"];
    if (!serviceAccountJson) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON environment variable is required");
    }
    let serviceAccount: admin.ServiceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson) as admin.ServiceAccount;
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    _initialized = true;
  }
  return admin.app();
}

export function getAdminFirestore(): admin.firestore.Firestore {
  return getAdminApp().firestore();
}

export async function verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
  return getAdminApp().auth().verifyIdToken(token);
}
