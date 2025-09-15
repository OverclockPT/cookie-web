"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { get, isAdmin, User } from "~/lib/backend/auth/user";
import { useAdminStore } from "~/lib/store/admin";
import { getCookie, setCookie } from "cookies-next";

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    refreshUser: () => Promise<void>;
    locale: string;
    setLocale: (locale: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {

    //Admin Status
    const { setIsAdmin } = useAdminStore();

    //User & Loading State
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [locale, setLocaleState] = useState<string>("pt");

    //Set Locale
    const setLocale = useCallback((newLocale: string) => {

        //Set Locale
        setLocaleState(newLocale);

        //Set Locale Cookie
        setCookie('NEXT_LOCALE', newLocale, {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
    }, []);

    //Get & Set Locale
    useEffect(() => {

        //Locale Cookie
        const localeCookie = getCookie('NEXT_LOCALE') as string;

        //Set Locale
        if (localeCookie) {
            setLocale(localeCookie);
        }
    }, [setLocale]);

    //Refresh User
    const refreshUser = useCallback(async () => {

        //Set Loading
        setLoading(true);

        //Attempt to Get User
        try {

            //Get User
            const user = await get();

            //Admin Status
            const adminStatus = await isAdmin();

            //Set User & Admin Status
            setUser(user);
            setIsAdmin(adminStatus.isAdmin);
        } catch {
            console.error('[UserContext] Error getting user');
            //Remove User
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [setIsAdmin, setUser]);

    //Refresh User on Mount
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    //Return Provider
    return (
        <UserContext.Provider value={{ user, setUser, loading, refreshUser, locale, setLocale }}>
            {children}
        </UserContext.Provider>
    );
}

//Export User Context
export function useUserContext() {
    //Context
    const context = useContext(UserContext);

    //Check if Context is Undefined
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }

    //Return Context
    return context;
} 