// Authentication service for Firebase Auth
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';

const USERS_COLLECTION = 'users';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yasserstore.com';

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get or create user document
    const user = await getOrCreateUserDocument(firebaseUser);
    
    return user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string, 
  password: string, 
  displayName?: string
): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update display name if provided
    if (displayName) {
      await updateProfile(firebaseUser, { displayName });
    }
    
    // Create user document
    const user = await getOrCreateUserDocument(firebaseUser);
    
    return user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

/**
 * Get or create user document in Firestore
 */
export async function getOrCreateUserDocument(firebaseUser: FirebaseUser): Promise<User> {
  try {
    const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || userData.displayName,
        isAdmin: userData.isAdmin || false,
        createdAt: userData.createdAt?.toDate() || new Date()
      };
    } else {
      // Create new user document
      const isAdmin = firebaseUser.email === ADMIN_EMAIL;
      const newUser: Omit<User, 'id'> = {
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || undefined,
        isAdmin,
        createdAt: new Date()
      };
      
      await setDoc(userRef, {
        ...newUser,
        createdAt: Timestamp.fromDate(newUser.createdAt)
      });
      
      return {
        id: firebaseUser.uid,
        ...newUser
      };
    }
  } catch (error) {
    console.error('Error getting/creating user document:', error);
    throw new Error('Failed to get user data');
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      
      if (firebaseUser) {
        try {
          const user = await getOrCreateUserDocument(firebaseUser);
          resolve(user);
        } catch (error) {
          console.error('Error getting current user:', error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await getOrCreateUserDocument(firebaseUser);
        callback(user);
      } catch (error) {
        console.error('Error in auth state change:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}

/**
 * Get user-friendly error messages
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred during authentication.';
  }
}