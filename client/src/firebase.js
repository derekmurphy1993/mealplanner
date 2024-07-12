// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "mernproj-6fe87.firebaseapp.com",
	projectId: "mernproj-6fe87",
	storageBucket: "mernproj-6fe87.appspot.com",
	messagingSenderId: "459495883684",
	appId: "1:459495883684:web:3e14b6623790eb9c99f731",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
