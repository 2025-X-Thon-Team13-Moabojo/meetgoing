import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setIsLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch additional user data from Firestore
                    const userDocRef = doc(db, "users", firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUser({ ...firebaseUser, ...userDoc.data() });
                    } else {
                        // Fallback if firestore doc doesn't exist yet
                        setUser(firebaseUser);
                    }
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (!auth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
                    <p className="text-gray-600 mb-6">
                        Firebase configuration is missing. Please create a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file in the project root with your Firebase keys.
                    </p>
                    <div className="text-left bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
                        <pre>
                            VITE_FIREBASE_API_KEY=...
                            VITE_FIREBASE_AUTH_DOMAIN=...
                            VITE_FIREBASE_PROJECT_ID=...
                        </pre>
                    </div>
                    <p className="text-sm text-gray-500">
                        Check the console for more details.
                    </p>
                </div>
            </div>
        );
    }

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: error.message };
        }
    };

    const signup = async (userData) => {
        try {
            const { email, password, name, ...otherData } = userData;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Update display name in Firebase Auth
            await updateFirebaseProfile(firebaseUser, { displayName: name });

            // Store additional user data in Firestore
            const userDocData = {
                uid: firebaseUser.uid,
                email,
                name,
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
                roles: [],
                categories: [],
                subCategories: [],
                region: '',
                bio: '',
                school: '',
                techStack: [],
                interests: [],
                awards: [],
                createdAt: new Date().toISOString(),
                ...otherData
            };

            await setDoc(doc(db, "users", firebaseUser.uid), userDocData);

            // State update handled by onAuthStateChanged
            return { success: true };
        } catch (error) {
            console.error("Signup error:", error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // State update handled by onAuthStateChanged
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const updateProfile = async (updatedData) => {
        if (!user || !user.uid) return;

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, updatedData);

            // Update local state optimistically
            setUser(prev => ({ ...prev, ...updatedData }));
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout, updateProfile }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
