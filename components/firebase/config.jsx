import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAVYY03yuERY7fzgFSDvcq_SyQ2jfakyC4",
    authDomain: "ai-trainer-database.firebaseapp.com",
    projectId: "ai-trainer-database",
    storageBucket: "ai-trainer-database.appspot.com",
    messagingSenderId: "229223064729",
    appId: "1:229223064729:web:f6e9d5f1986ef4443fc408",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export const usersRef = collection(db, 'users');
export const chatRoomRef = collection(db, 'chatRoom');


