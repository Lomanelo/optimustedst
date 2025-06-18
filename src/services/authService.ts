import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

// Constants
export const EMAIL_FOR_SIGNIN = 'emailForSignIn';

// Get the base URL without any query parameters for email sign-in
const getBaseURL = () => {
  const origin = window.location.origin;
  return window.location.href.includes('localhost') 
    ? `http://localhost:5173/email-signin` 
    : `${origin}/email-signin`;
};

const ACTION_CODE_SETTINGS = {
  // URL must be exact and include protocol (https://)
  url: getBaseURL(),
  // This must be true for email link sign-in
  handleCodeInApp: true,
};

/**
 * Send sign in email link
 */
export const sendSignInLink = async (email: string): Promise<void> => {
  try {
    // Clean the email by trimming whitespace
    const cleanEmail = email.trim();
    
    console.log("Sending sign-in link to:", cleanEmail);
    console.log("Using action code settings:", ACTION_CODE_SETTINGS);
    
    await sendSignInLinkToEmail(auth, cleanEmail, ACTION_CODE_SETTINGS);
    
    // Save the email locally to remember the user when they complete sign-in
    window.localStorage.setItem(EMAIL_FOR_SIGNIN, cleanEmail);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error sending sign in link:', error);
    return Promise.reject(error);
  }
};

/**
 * Complete sign in with email link
 */
export const completeSignInWithEmailLink = async (email?: string): Promise<any> => {
  try {
    // Get the FULL current URL without any modifications
    const currentUrl = window.location.href;
    console.log("Attempting to sign in with URL:", currentUrl);
    
    // Verify if the URL contains a sign-in link
    if (!isSignInWithEmailLink(auth, currentUrl)) {
      console.error("URL is not a valid sign-in link:", currentUrl);
      return Promise.reject(new Error('Invalid sign-in link'));
    }

    // Get the email from localStorage if not provided
    let signInEmail = email;
    if (!signInEmail) {
      const storedEmail = window.localStorage.getItem(EMAIL_FOR_SIGNIN);
      if (!storedEmail) {
        // If no email found, prompt the user to provide their email
        console.error("No email found in localStorage");
        return Promise.reject(new Error('No email found, please provide your email'));
      }
      signInEmail = storedEmail;
    }

    console.log("Completing sign-in for email:", signInEmail);
    
    // Clean the email by trimming whitespace
    const cleanEmail = signInEmail.trim();
    
    // Complete the sign-in process - DO NOT modify the URL when passing to Firebase
    const result = await signInWithEmailLink(auth, cleanEmail, currentUrl);
    
    // Clear the email from storage
    window.localStorage.removeItem(EMAIL_FOR_SIGNIN);
    
    // Clear the URL to remove the sign-in link
    // IMPORTANT: Only do this AFTER successful authentication
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    return result;
  } catch (error: any) {
    console.error('Error completing sign in with email link:', error);
    
    // Handle specific Firebase errors with more user-friendly messages
    if (error.code === 'auth/invalid-action-code') {
      return Promise.reject(new Error('The sign-in link has expired or already been used. Please request a new one.'));
    } else if (error.code === 'auth/invalid-email') {
      return Promise.reject(new Error('The email address provided does not match the one used to request this sign-in link.'));
    } else if (error.code === 'auth/user-disabled') {
      return Promise.reject(new Error('This user account has been disabled.'));
    }
    
    return Promise.reject(error);
  }
};

/**
 * Check if the current URL is a sign-in link
 */
export const isEmailLink = (url?: string): boolean => {
  // Use the exact URL passed or current URL without modifications
  const linkUrl = url || window.location.href;
  console.log("Checking if URL is email link:", linkUrl);
  
  // Use Firebase's built-in function to check if this is a sign-in link
  return isSignInWithEmailLink(auth, linkUrl);
}; 