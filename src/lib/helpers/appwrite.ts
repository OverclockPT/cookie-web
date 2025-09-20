import { ID, Permission, Role } from "~/lib/backend/appwrite";

//AppWrite Admin Team ID
const adminTeamId = process.env.NEXT_APPWRITE_ADMIN_TEAM_ID;

/**
 * Permissions Type
 * @description Permissions Type for AppWrite
 */
export const AppWritePermissions: {
    read: string[];
    write: string[];
    update: string[];
    delete: string[];
} = {
    read: [],
    write: [],
    update: [],
    delete: [],
};


/**
 * AppWrite Helper Methods
 */
export class AppWriteHelper {

    /**
     * Admin Document Permissions
     * 
     * Allows Admin Team to do WRUD Operations
     */
    public static adminDocumentPermissions = {
        read: [`team:${adminTeamId}`],
        write: [`team:${adminTeamId}`],
        update: [`team:${adminTeamId}`],
        delete: [`team:${adminTeamId}`],
    };

    /**
     * End-User Document Permissions
     * 
     * Allows End-User to do RU Operations on their Own Documents
     * @param userId - The User ID
     * @param read - Whether to allow Read Operations
     * @param update - Whether to allow Update Operations
     */
    public static endUserDocumentPermissions = ({ userId, read = true, update = true }: { userId: string, read?: boolean, update?: boolean }) => ({
        read: read ? [`user:${userId}`] : [],
        update: update ? [`user:${userId}`] : [],
    });

    /**
     * Extract ID from Permission
     * @param permission - The permission string
     * @returns The ID extracted from the permission
     */
    public static destructPermission = (permission: string): { type: 'user' | 'team', id: string } | null => {

        //Check if Permission is a User Permission
        if (permission.startsWith('user:')) {
            return { type: 'user', id: permission.substring(5) };
        }

        //Check if Permission is a Team Permission
        if (permission.startsWith('team:')) {
            return { type: 'team', id: permission.substring(5) };
        }

        //Return Null if Permission is Not a User or Team Permission
        return null;
    };

    /**
     * Convert Permissions to AppWrite REST Format
     * @param permissions - The Permissions to Convert
     * @returns The Converted Permissions
     */
    public static convertPermissions = (permissions: typeof AppWritePermissions) => {

        //Check if Permissions are Set
        if (!permissions) {
            return [];
        }

        //Converted Permissions
        const convertedPermissions: string[] = [];

        //Add Permissions
        const addPermissions = (permType: keyof typeof AppWritePermissions, permList?: string[]) => {

            //Check if Permission List is Set
            if (!permList) return;

            //Map AppWritePermissions Type to Permission Static Methods
            const permissionMethodMap: Record<keyof typeof AppWritePermissions, (role: string) => string> = {
                read: Permission.read,
                write: Permission.write,
                update: Permission.update,
                delete: Permission.delete,
            };

            //Permission Method
            const permissionMethod = permissionMethodMap[permType];

            //Loop Through Permission List
            for (const perm of permList) {

                //Extract ID from Permission
                const { type, id } = AppWriteHelper.destructPermission(perm) ?? { type: '', id: '' };

                //Check if Permission is a User Permission
                if (type === 'user') {
                    //Add Permission
                    convertedPermissions.push(permissionMethod(Role.user(id)));
                }

                //Check if Permission is a Team Permission
                else if (type === 'team') {

                    //Extract Team ID
                    const teamId = perm.replace('team:', '');

                    //Add Permission
                    convertedPermissions.push(permissionMethod(Role.team(teamId)));
                } else if (
                    perm === 'any' ||
                    perm === 'guests' ||
                    perm === 'users'
                ) {
                    //Use Known Role Static Methods
                    switch (perm) {
                        case 'any':
                            convertedPermissions.push(permissionMethod(Role.any()));
                            break;
                        case 'guests':
                            convertedPermissions.push(permissionMethod(Role.guests()));
                            break;
                        case 'users':
                            convertedPermissions.push(permissionMethod(Role.users()));
                            break;
                        default:
                            //Fallback: Treat as Raw ID for other known roles
                            convertedPermissions.push(permissionMethod(perm));
                            break;
                    }
                } else {
                    //Fallback: Treat as Raw ID (User/Team)
                    convertedPermissions.push(permissionMethod(perm));
                }
            }
        };

        //Add Permissions
        addPermissions('read', permissions.read);
        addPermissions('write', permissions.write);
        addPermissions('update', permissions.update);
        addPermissions('delete', permissions.delete);

        //Return Permissions
        return convertedPermissions;
    }

    /**
     * Generate Random AppWrite-Compatible ID
     * @returns The Random ID
     */
    public static generateRandomAppwriteId = () => {
        return ID.unique();
    }
}