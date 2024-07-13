// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "mealprep-4b092.firebaseapp.com",
	projectId: "mealprep-4b092",
	storageBucket: "mealprep-4b092.appspot.com",
	messagingSenderId: "273920798603",
	appId: "1:273920798603:web:ee0eebfcf78d15d14e898e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
