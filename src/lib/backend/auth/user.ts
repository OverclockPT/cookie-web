/**
 * This module handles User Authentication and Authorization.
 */
export class User {

    public static async get(): Promise<User | null> {
        return null;
    }

    public static async isAdmin(): Promise<boolean> {
        return false;
    }

}