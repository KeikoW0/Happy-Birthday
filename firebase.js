import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDh35sCDHNVEJTKnBVKo4Ptp7bIxvphqPM",
    authDomain: "birthday-girl-51784.firebaseapp.com",
    projectId: "birthday-girl-51784",
    storageBucket: "birthday-girl-51784.firebasestorage.app",
    messagingSenderId: "159038889866",
    appId: "1:159038889866:web:d5b73d917ad6627061f273"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };