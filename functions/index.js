const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Users Date Registering
// ===========================
exports.userCreatedAt = functions.firestore.document('users/{userId}').onCreate((snap, context) => {
  return snap.ref.set({ 'createdAt': new Date().getTime() }, { merge: true })
});

exports.userUpdatedAt = functions.firestore.document('users/{userId}').onUpdate((change, context) => {
  let data = change.after.data();
  // let previousData = change.before.data();
  let now = new Date().getTime();

  if (data.updatedAt > (now - (30 * 1000))) {
    return
  }

  return change.after.ref.set({ 'updatedAt': now }, { merge: true })
});
