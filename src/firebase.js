import firebase from "firebase";

const config = {
    apiKey: "AIzaSyB3GYcRcn40zuiUOL9oEiXC2pE7RWBPX8U",
    authDomain: "keepthenotes-bf133.firebaseapp.com",
    databaseURL: "https://keepthenotes-bf133.firebaseio.com",
    projectId: "keepthenotes-bf133",
    storageBucket: "keepthenotes-bf133.appspot.com",
    messagingSenderId: "682012368542"
  };
  
  firebase.initializeApp(config);
  export const auth = firebase.auth();
  export const provider = new firebase.auth.GoogleAuthProvider();
  export const db = firebase.firestore();