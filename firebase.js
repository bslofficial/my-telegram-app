import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig={
  apiKey:"AIzaSyB-a-pmGq2iOIlGoktR4W8J_vCLbrX4fu8",
  authDomain:"bsl-games.firebaseapp.com",
  databaseURL:"https://bsl-games-default-rtdb.firebaseio.com/",
  projectId:"bsl-games",
  storageBucket:"bsl-games.firebasestorage.app",
  messagingSenderId:"1022967787008",
  appId:"1:1022967787008:android:d7f49a2a3933037bb2b2e5"
};

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);
export const ADMIN_UID="7171624965";
export { db, ref, set };