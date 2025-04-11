import { initializeApp } from 'firebase/app';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA9jYWUN90ONtHpgPmCqd2UCdl6uw1-lbo",
  authDomain: "bluetoothscan-4f80b.firebaseapp.com",
  databaseURL: "https://bluetoothscan-4f80b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bluetoothscan-4f80b",
  storageBucket: "bluetoothscan-4f80b.firebasestorage.app",
  messagingSenderId: "327190635403",
  appId: "1:327190635403:web:70c9cc67c06f94f93b058e",
  measurementId: "G-NQMS5K8P3P"
};

export const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
