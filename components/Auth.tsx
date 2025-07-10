'use client';

import React, { useState, useEffect } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, UserData } from '@/lib/firebase';
import { createUserDocument, getUserData, updateUserStats } from '@/lib/userData';

interface AuthProps {
  onUserDataChange?: (userData: UserData | null) => void;
}

export default function Auth({ onUserDataChange }: AuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Load user data from Firestore
        let userDoc = await getUserData(currentUser.uid);
        
        // If user document doesn't exist, create it
        if (!userDoc) {
          userDoc = await createUserDocument(currentUser);
        }
        
        setUserData(userDoc);
        onUserDataChange?.(userDoc);
      } else {
        setUserData(null);
        onUserDataChange?.(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed in:', result.user.displayName);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show user info if logged in
  if (user && userData) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg shadow-md mb-6">
        <img 
          src={userData.photoURL || ''} 
          alt={userData.displayName || 'User'} 
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <p className="font-semibold text-lg">{userData.displayName}</p>
          <p className="text-sm text-gray-600">{userData.email}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Games Played</p>
          <p className="text-xl font-bold">{userData.gamesPlayed}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Wins</p>
          <p className="text-xl font-bold text-green-600">{userData.wins}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Win Rate</p>
          <p className="text-xl font-bold">
            {userData.gamesPlayed > 0 
              ? `${Math.round((userData.wins / userData.gamesPlayed) * 100)}%` 
              : '0%'}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Show login button if not logged in
  return (
    <div className="flex justify-center p-4">
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}