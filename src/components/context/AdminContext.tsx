"use client";

import { useEffect } from 'react';
import { useUserContext } from './UserContext';
import { useAdminStore } from '~/lib/store/admin';
import { isAdmin } from '~/lib/backend/auth/user';

/**
 * Admin Context
 * 
 * This component handles the initialization of admin status when the user context is available.
 * It should be placed in the app layout to ensure admin status is properly set on page refresh.
 */
export default function AdminContext() {

    //User & Admin
    const { user, loading: userLoading } = useUserContext();
    const { setIsAdmin, setLoading, initialized } = useAdminStore();

    //Initialize Admin Status
    useEffect(() => {

        //Initialize Admin Status
        const initializeAdminStatus = async () => {

            //Wait for User Loading to Complete
            if (userLoading) {
                return;
            }

            //If User is Not Authenticated and We Have Initialized Admin Status, Reset It
            if (!user && initialized) {
                setIsAdmin(false);
                return;
            }

            //If User is Authenticated and Admin Status is Not Initialized, Check Admin Status
            if (user && !initialized) {

                //Set Loading to True
                setLoading(true);

                //Attempt to Check Admin Status
                try {

                    //Add Timeout to Prevent Infinite Loading
                    const timeoutPromise = new Promise<never>((_, reject) => {
                        setTimeout(() => reject(new Error('Admin check timeout')), 3000);
                    });

                    //Check Admin Status
                    const adminCheckPromise = isAdmin();

                    //Race Admin Check Promise and Timeout Promise
                    const { isAdmin: adminStatus, fault } = await Promise.race([
                        adminCheckPromise,
                        timeoutPromise
                    ]);

                    //If Fault Occurred, Set Admin Status to False
                    if (fault) {
                        setIsAdmin(false);
                    } else {
                        setIsAdmin(adminStatus);
                    }
                } catch {
                    //Default to Non-Admin Status on Error
                    setIsAdmin(false);
                } finally {
                    setLoading(false);
                }
            }
        };

        //Small Delay to Ensure Proper Initialization
        const timer = setTimeout(() => {
            initializeAdminStatus();
        }, 150);

        return () => clearTimeout(timer);
    }, [user, userLoading, initialized, setIsAdmin, setLoading]);

    //Return Null - No UI
    return null;
} 