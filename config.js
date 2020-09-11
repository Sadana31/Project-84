import firebase from 'firebase';
require("@firebase/firestore");

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBLPUTGgPG7_fw5_Gtb-nUUQPk0duBF6iA",
    authDomain: "booksanta-b8615.firebaseapp.com",
    databaseURL: "https://booksanta-b8615.firebaseio.com",
    projectId: "booksanta-b8615",
    storageBucket: "booksanta-b8615.appspot.com",
    messagingSenderId: "218065543820",
    appId: "1:218065543820:web:209b0267a071507a6851a9",
    measurementId: "G-GRPLV4HGN4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
