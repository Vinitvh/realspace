import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPNQVri_OqIH370qqG3226l2BOzcW2SBM",
  authDomain: "realspace-bbaac.firebaseapp.com",
  projectId: "realspace-bbaac",
  storageBucket: "realspace-bbaac.appspot.com",
  messagingSenderId: "228897063445",
  appId: "1:228897063445:web:764b33cb0f413d7e67441c",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
