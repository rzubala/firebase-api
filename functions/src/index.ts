// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import * as serviceAccount from "../permissions.json";
import routes from './routes'
const firestoreFunctions = require('./firestore-functions')
import runFunctions from './firestore-index'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://fir-api-2fa3d..firebaseio.com",
});
const db = admin.firestore();

const app = express();
app.use(cors({origin: true}));

routes(app, db)

runFunctions(db)

exports.app = functions.https.onRequest(app);

exports.makeUppercase = firestoreFunctions.makeUppercase

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
