import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
    apiKey: "AIzaSyDkDGWldx3MSAaEzLJySPiuMQRY3-wWwjU",
    authDomain: "web-chat-react-982ea.firebaseapp.com",
    projectId: "web-chat-react-982ea",
    storageBucket: "web-chat-react-982ea.appspot.com",
    messagingSenderId: "457725062514",
    appId: "1:457725062514:web:57d95bbe109154565381eb",
    measurementId: "G-KK1HKJ2B55"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)


// import.meta.env.VITE_API_KEY