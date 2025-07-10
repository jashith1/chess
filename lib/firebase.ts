import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "chess-2a83f.firebaseapp.com",
  projectId: "chess-2a83f",
  storageBucket: "chess-2a83f.firebasestorage.app",
  messagingSenderId: "719050147978",
  appId: "1:719050147978:web:70e3f45baae453f479c573",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  gamesPlayed: number;
  wins: number;
  createdAt: Date;
}