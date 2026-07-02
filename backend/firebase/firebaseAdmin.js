import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "./serviceAccount.json" with { type: "json" };

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const auth = getAuth();
export const db = getFirestore();