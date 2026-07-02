import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db, googleProvider } from "../firebase/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Email Signup
  const signup = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: name,
    });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name,
      email,
      elo: 1000,
      wins: 0,
      losses: 0,
      coins: 0,
      createdAt: new Date(),
    });

    return userCredential;
  };

  // Email Login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    const ref = doc(db, "users", result.user.uid);

    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        elo: 1000,
        wins: 0,
        losses: 0,
        coins: 0,
        createdAt: new Date(),
      });
    }

    return result;
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}