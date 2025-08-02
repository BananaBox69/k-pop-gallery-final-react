import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration from the original config.js
const firebaseConfig = {
    apiKey: "AIzaSyB3Ol6D8JcH_knurzbmV5zBljCFWhj95fY",
    authDomain: "k-pop-pricelist-phone-vers.firebaseapp.com",
    projectId: "k-pop-pricelist-phone-vers",
    storageBucket: "k-pop-pricelist-phone-vers.firebasestorage.app",
    messagingSenderId: "507855648935",
    appId: "1:507855648935:web:b367bc772b285d5f1c4382"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };