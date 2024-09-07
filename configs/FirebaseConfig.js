// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCopkouFf6s2SuptrJKUhIofU1S6nGCZ8Y",
  authDomain: "kuttappu-business.firebaseapp.com",
  projectId: "kuttappu-business",
  storageBucket: "kuttappu-business.appspot.com",
  messagingSenderId: "582259011938",
  appId: "1:582259011938:web:529bf71410e46c850b3c3b",
  measurementId: "G-XBR5KV3F2Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage=getStorage(app);
// const analytics = getAnalytics(app);