'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/interactive/button';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useAdminStore } from '@/store/admin';
import { NavigationHelper } from '@/lib/utils/helpers/frontend/navigation';
import { useState, useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../general/dialog';
import { useAuth } from '@/lib/utils/hooks/user';
import { Constants } from '@/lib/utils/helpers/general/constants';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
    //User & Admin Status
    const { user, loading: userLoading } = useUserContext();
    const { isAdmin, initialized, loading: adminLoading, setLoading: setAdminLoading } = useAdminStore();
    const { signOut } = useAuth();

    //Translations
    const tr = useTranslations('navigation.header');

    //Stop Admin Loading When User is Found
    useEffect(() => {
        if (user) {
            setAdminLoading(false);
        }
    }, [setAdminLoading, user]);

    //Router
    const router = useRouter();

    //Theme
    const { theme, setTheme } = useTheme();

    //Pathname
    const pathname = usePathname();
    const currentLocale = pathname.split('/')[1] || 'pt';

    //Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [openSignOutDialog, setOpenSignOutDialog] = useState(false);

    //Shimmer: Show Shimmer Until User & Admin Status are Ready
    const isLoading = userLoading || adminLoading || !initialized || isAdmin === null;

    //Handle Logout
    const handleLogout = async () => {

        //Sign Out
        const success = await signOut();

        //Redirect to Home
        if (success) router.push(`/${currentLocale}/`);
    };

    //Theme Toggle
    const handleThemeToggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    //Check if Link is Active
    function isLinkActive(linkHref: string) {

        //Normalize Link & Path
        const normalize = (str: string) => str.replace(/\/$/, '');
        const normalizedLink = normalize(linkHref);
        const normalizedPath = normalize(pathname);

        //Match Exact for the Main Admin Page
        if (normalizedLink === `/${currentLocale}/admin`) {
            return normalizedPath === normalizedLink;
        }

        //Match Exact or as a Prefix
        return (
            normalizedPath === normalizedLink ||
            normalizedPath.startsWith(`${normalizedLink}/`)
        );
    }

    //UI
    return (
        <header className="flex items-center justify-between p-4 bg-background text-foreground shadow-md dark:shadow-lg dark:border-b dark:border-border">

            {/* Logo & Admin Status */}
            <div className="flex items-center space-x-4">

                {/* Logo */}
                <Link
                    href={`/${currentLocale}/`}
                    className="text-2xl font-bold tracking-tight text-foreground"
                >
                    Portal ACRD
                </Link>

                {/* Admin Status */}
                {isAdmin && (
                    <span className="text-sm text-muted-foreground">
                        Admin
                    </span>
                )}
            </div>

            {/* Shimmer */}
            {isLoading && (
                <>
                    {/* Navigation Links Shimmer */}
                    <nav className="flex items-center space-x-4">
                        {/* Simulate 2-3 Navigation Links with Varying Widths */}
                        <div className="animate-pulse bg-muted h-9 w-24 rounded-md"></div>
                        <div className="animate-pulse bg-muted h-9 w-32 rounded-md"></div>
                        <div className="animate-pulse bg-muted h-9 w-20 rounded-md"></div>
                    </nav>

                    {/* User Dropdown Shimmer */}
                    <div className="animate-pulse bg-muted h-9 w-32 rounded-md"></div>
                </>
            )}

            {/* Navigation & Dropdown */}
            {!isLoading && user && (
                <>
                    <nav className="flex items-center space-x-4">
                        {(isAdmin ? Constants.adminNavLinks : Constants.navLinks).map((link) => {
                            //External Slug
                            const externalSlug = Constants.internalToExternalSlugs[link.href]?.[currentLocale] || link.href;

                            //Link HREF
                            const linkHref = `/${currentLocale}/${externalSlug}`;

                            //Active Link
                            const active = isLinkActive(linkHref);
                            return (
                                <Button asChild variant="ghost" key={link.href}>
                                    <Link
                                        href={linkHref}
                                        className={`text-foreground hover:bg-accent ${active ? 'bg-accent font-semibold' : ''
                                            }`}
                                    >
                                        {tr(`links.${link.text}`)}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                    <div
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <Button
                            variant="ghost"
                            className="text-foreground hover:bg-accent focus:outline-none focus:ring-0 cursor-pointer"
                            onBlur={() => setIsDropdownOpen(false)}
                        >
                            {tr('hello', { name: user?.name })}
                        </Button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full w-56 bg-popover text-popover-foreground border rounded-md shadow-lg z-50">
                                <div className="py-1">
                                    {(() => {

                                        //Links
                                        const links = NavigationHelper.dropdownLinks;

                                        //Dropdown Items
                                        return (
                                            <>
                                                {/* Language Switcher */}
                                                <LanguageSwitcher />

                                                {/* Dropdown Sections */}
                                                {NavigationHelper.dropdownSections.map((section) => {

                                                    //Links for the Section
                                                    const sectionLinks = links.filter(link => link.section === section.section);

                                                    //Return the Section
                                                    return (
                                                        <div key={section.section}>
                                                            {/* Section Header */}
                                                            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                                {tr(`dropdown.sections.${section.section}`)}
                                                            </div>

                                                            {/* Section Links */}
                                                            {sectionLinks.map((link, idx) => {

                                                                //Theme Link
                                                                if (link.internalSlug === 'theme') {
                                                                    return (
                                                                        <div key={idx}>
                                                                            <div
                                                                                className="block px-3 py-2 text-sm hover:bg-accent cursor-pointer flex items-center gap-2"
                                                                                onClick={handleThemeToggle}
                                                                            >
                                                                                {theme === 'dark' ? (
                                                                                    <Sun className="w-4 h-4" />
                                                                                ) : (
                                                                                    <Moon className="w-4 h-4" />
                                                                                )}
                                                                                {tr(`${link.text}`)}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }

                                                                //Other Links
                                                                return (
                                                                    <div key={idx}>
                                                                        <Link
                                                                            href={`/${currentLocale}/${link.internalSlug}`}
                                                                            passHref
                                                                            className="block px-3 py-2 text-sm hover:bg-accent cursor-pointer flex items-center gap-2"
                                                                        >
                                                                            {link.icon && <link.icon className="w-4 h-4" />}
                                                                            {tr(`${link.text}`)}
                                                                        </Link>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        );
                                    })()}
                                    <div className="border-t border"></div>
                                    <button
                                        className="w-full px-3 py-2 text-sm text-destructive hover:text-destructive/80 hover:bg-accent cursor-pointer flex items-center gap-2"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setOpenSignOutDialog(true);
                                        }}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>{tr('dropdown.logout')}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Sign Out */}
            <Dialog open={openSignOutDialog} onOpenChange={setOpenSignOutDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tem certeza que deseja sair do Portal?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenSignOutDialog(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setOpenSignOutDialog(false);
                                handleLogout();
                            }}
                        >
                            Sair
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </header>
    );
}