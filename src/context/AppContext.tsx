'use client';
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
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
}
const AppContext = createContext<AppContextType | undefined>(undefined);
export function AppProvider({ children }: {
    children: ReactNode;
}) {
    const [savedColleges, setSavedColleges] = useLocalStorage<string[]>('colla_saved_colleges', []);
    const [compareColleges, setCompareColleges] = useLocalStorage<string[]>('colla_compare_colleges', []);
    const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>('colla_recently_viewed', []);
    const [user, setUser] = useLocalStorage<User | null>('colla_user', null);
    const [savedComparisons, setSavedComparisons] = useLocalStorage<SavedComparison[]>('colla_saved_comparisons', []);
    const toggleSaveCollege = useCallback((id: string) => {
        setSavedColleges((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
    }, [setSavedColleges]);
    const isSaved = useCallback((id: string) => {
        return savedColleges.includes(id);
    }, [savedColleges]);
    const toggleCompareCollege = useCallback((id: string) => {
        setCompareColleges((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            if (prev.length >= 2) {
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
    const login = useCallback((name: string, email: string) => {
        setUser({
            id: Math.random().toString(36).substring(2, 11),
            name,
            email,
            isPremium: true
        });
    }, [setUser]);
    const signup = useCallback((name: string, email: string) => {
        setUser({
            id: Math.random().toString(36).substring(2, 11),
            name,
            email,
            isPremium: true
        });
    }, [setUser]);
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
            deleteComparisonSet
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
