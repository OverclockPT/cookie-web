import { NavigationHelper } from "@/lib/utils/helpers/frontend/navigation";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Constants } from "@/lib/utils/helpers/general/constants";



/**
 * Get External Slug from Internal Slug
 */
function getExternalSlugFromInternal(internalSlug: string, locale: string): string | null {
    const map = Constants.internalToExternalSlugs[internalSlug];
    return map ? map[locale] : null;
}

/**
 * Convert path from one locale to another, handling slug translations
 */
function convertPathToNewLocale(currentPath: string, currentLocale: string, newLocale: string): string {
    // Remove the current locale from the path
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '') || '/';
    
    // If it's just the root path, return the new locale root
    if (pathWithoutLocale === '/' || pathWithoutLocale === '') {
        return `/${newLocale}`;
    }
    
    // Remove leading slash for processing
    const cleanPath = pathWithoutLocale.startsWith('/') ? pathWithoutLocale.substring(1) : pathWithoutLocale;
    
    // Sort by length (longest first) to match the most specific path
    const sortedEntries = Object.entries(Constants.internalToExternalSlugs).sort((a, b) => {
        const aExternal = a[1][currentLocale] || '';
        const bExternal = b[1][currentLocale] || '';
        return bExternal.length - aExternal.length;
    });
    
    // Try to find a matching external slug for the current locale
    for (const [internalKey, localeMap] of sortedEntries) {
        const currentExternalSlug = localeMap[currentLocale];
        if (currentExternalSlug && (cleanPath === currentExternalSlug || cleanPath.startsWith(currentExternalSlug + '/'))) {
            // Found a match, now get the external slug for the new locale
            const newExternalSlug = localeMap[newLocale];
            if (newExternalSlug) {
                const remainingPath = cleanPath.substring(currentExternalSlug.length);
                return `/${newLocale}/${newExternalSlug}${remainingPath}`;
            }
            // If no translation exists for the new locale, use internal slug
            const remainingPath = cleanPath.substring(currentExternalSlug.length);
            return `/${newLocale}/${internalKey}${remainingPath}`;
        }
    }
    
    // If no matching external slug found, check if it's already an internal slug
    for (const internalKey of Object.keys(Constants.internalToExternalSlugs)) {
        if (cleanPath === internalKey || cleanPath.startsWith(internalKey + '/')) {
            const newExternalSlug = getExternalSlugFromInternal(internalKey, newLocale);
            if (newExternalSlug) {
                const remainingPath = cleanPath.substring(internalKey.length);
                return `/${newLocale}/${newExternalSlug}${remainingPath}`;
            }
            // If no translation exists, keep the internal slug
            return `/${newLocale}/${cleanPath}`;
        }
    }
    
    // If no slug translation is needed, just change the locale
    return `/${newLocale}/${cleanPath}`;
}

export function LanguageSwitcher() {

    //Router
    const router = useRouter();

    //Pathname
    const pathname = usePathname();

    //Locale
    const currentLocale = useLocale();

    //UI
    return (
        <div className="flex flex-row gap-2 p-2">
            {NavigationHelper.languages.map((language) => {

                //Check if the Language is the Current Language
                const isCurrentLanguage = language.value === currentLocale;

                //Return the Language
                return (
                    <button
                        key={language.value}
                        type="button"
                        className={`px-2 py-1 rounded text-sm transition-colors cursor-pointer ${isCurrentLanguage
                            ? 'bg-accent font-medium text-foreground'
                            : 'bg-transparent text-muted-foreground hover:bg-accent/50 cursor-pointer'
                            }`}
                        onClick={async () => {
                            // Convert current path to the new locale with proper slug translation
                            const newPath = convertPathToNewLocale(pathname, currentLocale, language.value);
                            
                            // Set the locale cookie
                            try {
                                await fetch('/api/locale/set-cookie', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ locale: language.value }),
                                });
                            } catch (error) {
                                console.error('Failed to set locale cookie:', error);
                            }
                            
                            // Navigate to the translated path
                            router.push(newPath);
                        }}
                        disabled={isCurrentLanguage}
                    >
                        {language.icon}
                    </button>
                );
            })}
        </div>
    );

}