'use client';
import React, { createContext, useContext, ReactNode, useCallback, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, SavedComparison } from '../types';

interface AppContextType {
    savedColleges: string[];
    toggleSaveCollege: (id: string) => void;
    isSaved: (id: string) => boolean;
    compareColleges: string[];
    toggleCompareCollege: (id: string) => void;
    removeFromCompare: (id: string) => void;
    isComparing: (id: string) => boolean;
    clearCompare: () => void;
    recentlyViewed: string[];
    addToRecentlyViewed: (id: string) => void;
    user: User | null;
    login: (name: string, email: string) => void;
    signup: (name: string, email: string) => void;
    logout: () => void;
    savedComparisons: SavedComparison[];
    saveComparisonSet: (name: string, collegeIds: string[]) => void;
    deleteComparisonSet: (id: string) => void;
    compareWarning: string;
    clearCompareWarning: () => void;
    isAuthOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: {
    children: ReactNode;
}) {
    const [user, setUser] = useLocalStorage<User | null>('colla_user', null);
    const [compareWarning, setCompareWarning] = useState<string>('');
    const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

    const openAuthModal = useCallback(() => setIsAuthOpen(true), []);
    const closeAuthModal = useCallback(() => setIsAuthOpen(false), []);

    // Dynamically scope storage keys to user ID if authenticated
    const userCollegesKey = user ? `colla_${user.id}_saved_colleges` : 'colla_saved_colleges';
    const userCompareKey = user ? `colla_${user.id}_compare_colleges` : 'colla_compare_colleges';
    const userComparisonsKey = user ? `colla_${user.id}_saved_comparisons` : 'colla_saved_comparisons';

    const [savedColleges, setSavedColleges] = useLocalStorage<string[]>(userCollegesKey, []);
    const [compareColleges, setCompareColleges] = useLocalStorage<string[]>(userCompareKey, []);
    const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>('colla_recently_viewed', []);
    const [savedComparisons, setSavedComparisons] = useLocalStorage<SavedComparison[]>(userComparisonsKey, []);

    const toggleSaveCollege = useCallback((id: string) => {
        setSavedColleges((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
    }, [setSavedColleges]);

    const isSaved = useCallback((id: string) => {
        return savedColleges.includes(id);
    }, [savedColleges]);

    const clearCompareWarning = useCallback(() => {
        setCompareWarning('');
    }, []);

    const toggleCompareCollege = useCallback((id: string) => {
        setCompareColleges((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            if (prev.length >= 2) {
                setCompareWarning('Comparison slot is full. You can only compare up to 2 colleges side-by-side.');
                return prev;
            }
            return [...prev, id];
        });
    }, [setCompareColleges]);

    const removeFromCompare = useCallback((id: string) => {
        setCompareColleges((prev) => prev.filter((item) => item !== id));
    }, [setCompareColleges]);

    const isComparing = useCallback((id: string) => {
        return compareColleges.includes(id);
    }, [compareColleges]);

    const clearCompare = useCallback(() => {
        setCompareColleges([]);
    }, [setCompareColleges]);

    const addToRecentlyViewed = useCallback((id: string) => {
        setRecentlyViewed((prev) => {
            const filtered = prev.filter((item) => item !== id);
            return [id, ...filtered].slice(0, 5);
        });
    }, [setRecentlyViewed]);

    // Copy anonymous local storage items to newly logged-in user key if user key is empty
    const copyAnonDataToUser = useCallback((newUserId: string) => {
        if (typeof window === 'undefined') return;

        const anonColleges = window.localStorage.getItem('colla_saved_colleges');
        const userCollegesKeyNew = `colla_${newUserId}_saved_colleges`;
        if (anonColleges && !window.localStorage.getItem(userCollegesKeyNew)) {
            window.localStorage.setItem(userCollegesKeyNew, anonColleges);
        }

        const anonCompare = window.localStorage.getItem('colla_compare_colleges');
        const userCompareKeyNew = `colla_${newUserId}_compare_colleges`;
        if (anonCompare && !window.localStorage.getItem(userCompareKeyNew)) {
            window.localStorage.setItem(userCompareKeyNew, anonCompare);
        }

        const anonComparisons = window.localStorage.getItem('colla_saved_comparisons');
        const userComparisonsKeyNew = `colla_${newUserId}_saved_comparisons`;
        if (anonComparisons && !window.localStorage.getItem(userComparisonsKeyNew)) {
            window.localStorage.setItem(userComparisonsKeyNew, anonComparisons);
        }
    }, []);

    const login = useCallback((name: string, email: string) => {
        const newId = Math.random().toString(36).substring(2, 11);
        copyAnonDataToUser(newId);
        setUser({
            id: newId,
            name,
            email,
            isPremium: true
        });
    }, [setUser, copyAnonDataToUser]);

    const signup = useCallback((name: string, email: string) => {
        const newId = Math.random().toString(36).substring(2, 11);
        copyAnonDataToUser(newId);
        setUser({
            id: newId,
            name,
            email,
            isPremium: true
        });
    }, [setUser, copyAnonDataToUser]);

    const logout = useCallback(() => {
        setUser(null);
    }, [setUser]);

    const saveComparisonSet = useCallback((name: string, collegeIds: string[]) => {
        setSavedComparisons((prev) => [
            {
                id: Math.random().toString(36).substring(2, 11),
                name,
                collegeIds,
                timestamp: new Date().toISOString()
            },
            ...prev
        ]);
    }, [setSavedComparisons]);

    const deleteComparisonSet = useCallback((id: string) => {
        setSavedComparisons((prev) => prev.filter((item) => item.id !== id));
    }, [setSavedComparisons]);

    return (<AppContext.Provider value={{
            savedColleges,
            toggleSaveCollege,
            isSaved,
            compareColleges,
            toggleCompareCollege,
            removeFromCompare,
            isComparing,
            clearCompare,
            recentlyViewed,
            addToRecentlyViewed,
            user,
            login,
            signup,
            logout,
            savedComparisons,
            saveComparisonSet,
            deleteComparisonSet,
            compareWarning,
            clearCompareWarning,
            isAuthOpen,
            openAuthModal,
            closeAuthModal
        }}>
      {children}
    </AppContext.Provider>);
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

