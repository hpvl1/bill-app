import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyBeBG-Q3IfUOaa6WisfxrZ_pktWe7aF40c',
  authDomain: 'bill-app-e1dcc.firebaseapp.com',
  projectId: 'bill-app-e1dcc',
  storageBucket: 'bill-app-e1dcc.appspot.com',
  messagingSenderId: '598797848787',
  appId: '1:598797848787:web:05b4193dd8ac016608c426',
  measurementId: 'G-VKL2BBBCV9',
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export default db;
