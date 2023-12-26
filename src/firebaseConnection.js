import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyDo4izwY3DQ1o2UspssH4nxPE0H9k_CqeM",
    authDomain: "curso-bfe3e.firebaseapp.com",
    projectId: "curso-bfe3e",
    storageBucket: "curso-bfe3e.appspot.com",
    messagingSenderId: "995110573715",
    appId: "1:995110573715:web:5809337210815b37ac5f66",
    measurementId: "G-N104PQGP78"
  };

  const firebase = initializeApp(firebaseConfig)
  const db = getFirestore(firebase)
  const auth = getAuth(firebase)

  export { db, auth }