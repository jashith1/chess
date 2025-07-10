import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, UserData } from './firebase';

// Create new user document
export async function createUserDocument(user: User): Promise<UserData> {
  const userData: UserData = {
    uid: user.uid,
    displayName: user.displayName || 'Anon',
    email: user.email || '',
    photoURL: user.photoURL || '',
    gamesPlayed: 0,
    wins: 0,
    createdAt: new Date(),
  };

  // Create document in firestore with user's UID as identifier
  await setDoc(doc(db, 'users', user.uid), userData);
  
  return userData;
}

// Get user data from Firestore
export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

// Update user stats (after a game)
export async function updateUserStats(uid: string, won: boolean): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    // If not logged in
    if (!userDoc.exists()) return;

    const currentData = userDoc.data() as UserData;
      
    await updateDoc(userRef, {
      gamesPlayed: currentData.gamesPlayed + 1,
      wins: won ? currentData.wins + 1 : currentData.wins,
    });
    
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}