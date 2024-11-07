// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASEAPI_KEY,
  authDomain: "mernestate-d0951.firebaseapp.com",
  projectId: "mernestate-d0951",
  storageBucket: "mernestate-d0951.appspot.com",
  messagingSenderId: "599525596818",
  appId: "1:599525596818:web:a47f808d680d0b66d3504b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);