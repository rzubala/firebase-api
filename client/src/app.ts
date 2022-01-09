import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore'
import runFunctions from './firestore-index'

initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://fir-api-2fa3d..firebaseio.com",
});

const db = getFirestore();
runFunctions(db)
