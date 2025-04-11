import { app } from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";

const db = getFirestore(app);
// const usersRef = doc(db, 'users', 'users');
export async function getUsers() {
  const userCol = collection(db, "users");
  // const docRef = doc(db, "users", "1");
  // const docSnap = await getDoc(docRef);
  const usersSnapshot = await getDocs(userCol);
  // if (usersSnapshot.exists()) {
  //   console.log("Document data:", usersSnapshot.data());
  // } else {
  //   // docSnap.data() will be undefined in this case
  //   console.log("No such document!");
  // }
  const usersList = usersSnapshot.docs.map((doc) => doc.data());
  console.log("usersList", usersList);
  return usersList;
}
