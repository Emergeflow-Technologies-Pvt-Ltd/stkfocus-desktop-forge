// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0k5idCbj3o1EmqgxcdZGojr44bl6c11w",
  authDomain: "test-stockfocus.firebaseapp.com",
  projectId: "test-stockfocus",
  storageBucket: "test-stockfocus.appspot.com",
  messagingSenderId: "530088277489",
  appId: "1:530088277489:web:72423ab5f6042c33784050",
  measurementId: "G-L27B9D5EGN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("App is ", app);
export const auth = getAuth(app);

console.log("Auth is", auth);
