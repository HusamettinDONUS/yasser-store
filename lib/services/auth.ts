// Authentication service for NextAuth.js
import { signIn, signOut, getSession } from 'next-auth/react';

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      throw new Error(getAuthErrorMessage(result.error));
    }
    
    return result;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string, 
  password: string, 
  name?: string
) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create account');
    }
    
    // Auto sign in after successful registration
    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    if (signInResult?.error) {
      throw new Error('Account created but failed to sign in');
    }
    
    return data.user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message || 'Failed to create account');
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const session = await getSession();
    return (session?.user as any)?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get user-friendly error messages
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'CredentialsSignin':
      return 'Invalid email or password.';
    case 'EmailNotVerified':
      return 'Please verify your email address.';
    case 'AccountNotLinked':
      return 'Account is not linked to this provider.';
    case 'CallbackRouteError':
      return 'Authentication callback error.';
    case 'Signin':
      return 'Sign in error occurred.';
    case 'OAuthSignin':
      return 'OAuth sign in error.';
    case 'OAuthCallback':
      return 'OAuth callback error.';
    case 'OAuthCreateAccount':
      return 'Could not create OAuth account.';
    case 'EmailCreateAccount':
      return 'Could not create account with email.';
    case 'Callback':
      return 'Callback error occurred.';
    case 'OAuthAccountNotLinked':
      return 'OAuth account is not linked.';
    case 'EmailSignin':
      return 'Email sign in error.';
    case 'CredentialsSignup':
      return 'Could not create account.';
    case 'SessionRequired':
      return 'Please sign in to access this page.';
    default:
      return 'An authentication error occurred.';
  }
}