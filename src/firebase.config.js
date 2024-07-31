// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// TODO: Change static config to dynamic config to be stored on server
const firebaseConfig = {
  apiKey: "AIzaSyBIfUlbKTAnIY2EhEScwRdBxbJckmuoo4I",
  authDomain: "stk-focus.firebaseapp.com",
  projectId: "stk-focus",
  storageBucket: "stk-focus.appspot.com",
  messagingSenderId: "419412412752",
  appId: "1:419412412752:web:57f4c77701af70b9840455",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
