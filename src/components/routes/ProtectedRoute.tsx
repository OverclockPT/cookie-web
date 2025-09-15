'use client';

import { useUserContext } from '~/components/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

//Protected Route
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

    //User Context
    const { user, loading } = useUserContext();

    //Router
    const router = useRouter();

    //Handle Navigation when User is Not Authenticated
    useEffect(() => {

        //Check if User is Authenticated
        if (!loading && !user) {

            //Current Path
            const currentPath = window.location.pathname;

            //Locale Match
            const localeMatch = currentPath.match(/^\/([a-z]{2})(?:\/|$)/);

            //Locale
            const locale = localeMatch ? localeMatch[1] : 'pt';

            //Redirect to Locale
            router.push(`/${locale}`);
        }
    }, [user, loading, router]);

    //Wait for User Loading to Complete
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-lg">A carregar...</div>
            </div>
        );
    }

    //Check if User is Authenticated
    if (!user) {
        return null;
    }

    //Return Children
    return <>{children}</>;
} 