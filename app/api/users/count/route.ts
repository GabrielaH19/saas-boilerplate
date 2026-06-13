import { NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        } as any),
      })
    : getApps()[0];

const db = getFirestore(app);

export async function GET() {
  const snap = await db.collection("users").count().get();
  const count = snap.data().count;
  return NextResponse.json({ count, isFounder: count < 100 });
}