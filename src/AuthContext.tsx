import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'visitor' | null;
  loading: boolean;
  connectionIssue: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  role: null, 
  loading: true,
  connectionIssue: false 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'visitor' | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionIssue, setConnectionIssue] = useState(false);

  useEffect(() => {
    // Connection test to help diagnose network issues with the auth domain
    const testConnection = async () => {
      try {
        // @ts-ignore - accessing internal config for testing
        const authDomain = auth.config?.authDomain;
        if (authDomain) {
          await fetch(`https://${authDomain}/__/auth/handler`, { mode: 'no-cors' });
          console.log("Firebase Auth Domain is reachable");
          setConnectionIssue(false);
        }
      } catch (error) {
        console.warn("Firebase Auth Domain might be unreachable from this network. This can cause login timeouts.", error);
        setConnectionIssue(true);
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            // Default role for new users
            const isDefaultAdmin = currentUser.email === "fastinsms.com@gmail.com";
            const newRole = isDefaultAdmin ? 'admin' : 'visitor';
            await setDoc(doc(db, 'users', currentUser.uid), {
              email: currentUser.email,
              role: newRole
            });
            setRole(newRole);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, connectionIssue }}>
      {children}
    </AuthContext.Provider>
  );
};
