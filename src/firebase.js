import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // your firebase credentials go here
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.firestore();
const auth = firebase.auth();

//Google's Authentication
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default database;
