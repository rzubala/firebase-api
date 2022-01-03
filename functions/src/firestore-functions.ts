import * as functions from "firebase-functions";

// Listens for new messages added to /items/:itemId/item and creates an
// uppercase version of the message to /items/:itemId/uppercase
exports.makeUppercase = functions.firestore
  .document("/items/{itemId}")
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().item;

    // Access the parameter `{itemId}` with `context.params`
    functions.logger.log("Uppercasing", context.params.itemId, original);

    const uppercase = original.toUpperCase();

    console.log("upper case", original, uppercase, context.params.itemId);

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });
