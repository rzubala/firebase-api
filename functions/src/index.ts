// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import * as serviceAccount from "../permissions.json";
import routes from './routes'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://fir-api-2fa3d..firebaseio.com",
});
const db = admin.firestore();

const app = express();
app.use(cors({origin: true}));

routes(app, db)

exports.app = functions.https.onRequest(app);

// Listens for new messages added to /items/:itemId/item and creates an
// uppercase version of the message to /items/:itemId/uppercase
exports.makeUppercase = functions.firestore.document("/items/{itemId}")
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().item;

      // Access the parameter `{itemId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.itemId, original);
      
      const uppercase = original.toUpperCase();

      console.log("upper case", original, uppercase, context.params.itemId)
      
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });