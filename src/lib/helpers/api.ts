/**
 * API Helper Methods
 */
export class ApiHelper {

    /**
     * Get API URL
     * @param path - The path to the API Route
     * @param req  - (Optional) NextRequest or Node Request object (server-side only)
     * @returns The absolute or relative API URL
     */
    public static getApiUrl(path: string, req?: Request) {

        //Check if Server
        const isServer = typeof window === 'undefined';

        //Check if Client
        if (!isServer) {
            //Client: Use Relative Path so Cookies Work Automatically
            return path;
        }

        //Origin
        let origin: string | undefined;

        //Check if Request is Provided
        if (req) {

            //Check Protocol
            const proto = req.headers.get('x-forwarded-proto');

            //Check Host
            const host = req.headers.get('x-forwarded-host') || req.headers.get('host');

            //Check if Host is Present
            if (host) {
                origin = `${proto}://${host}`;
            }
        }

        //Fallback to Environment Variable if No Request Object Provided
        if (!origin) {
            origin = process.env.NEXT_PUBLIC_BASE_URL;
        }

        //Return Relative API URL
        return `${origin}/api/${path}`;
    };
}