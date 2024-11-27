// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaTgMmGxo_mTWL6VNc5qLKG3ujQaepID0",
  authDomain: "em-webapp.firebaseapp.com",
  projectId: "em-webapp",
  storageBucket: "em-webapp.appspot.com",
  messagingSenderId: "36894981955",
  appId: "1:36894981955:web:2cbfe1d8f3ef449f8439f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {app,storage,firebaseConfig}