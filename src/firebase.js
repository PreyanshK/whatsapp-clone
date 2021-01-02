import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnOk7JZavM0yY-4BTuoTM5QtfI1qwD2QQ",
  authDomain: "whatsapp-clone-9b278.firebaseapp.com",
  projectId: "whatsapp-clone-9b278",
  storageBucket: "whatsapp-clone-9b278.appspot.com",
  messagingSenderId: "418968485886",
  appId: "1:418968485886:web:a5f7b33bbc01bfa0cb4aaf",
  measurementId: "G-6QSG0Q8C17"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.firestore();
const auth = firebase.auth();

//Google's Authentication
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default database;