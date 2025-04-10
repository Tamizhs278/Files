import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAHW_X3MuDdT3pKg7lv39YpNJgTsg5t90",
  authDomain: "files-974b6.firebaseapp.com",
  projectId: "files-974b6",
  storageBucket: "files-974b6.firebasestorage.app",
  messagingSenderId: "675651773890",
  appId: "1:675651773890:web:4247ea2fb3d6af2c4e225b",
  measurementId: "G-VDRWS0717M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;

const db=getFirestore(app);
const Filesdb =getStorage(app);

export {db ,Filesdb };