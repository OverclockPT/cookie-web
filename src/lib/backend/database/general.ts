import { databases } from '~/lib/backend/appwrite';
import { AppWriteHelper, AppWritePermissions } from '~/lib/helpers/appwrite';

//Database
const envDatabaseId = process.env.NEXT_APPWRITE_DATABASE_ID ?? 'main';

//TODO: Adapt to Use Client / Server SDKs

/**
 * Database Manager
 */
class Database {

    /**
     * Fetch Documents from Collection
     * @param collectionId - The ID of the Collection to fetch Documents from
     * @param queries - The queries to fetch Documents with - Optional
     * @param databaseId - The ID of the Database to fetch Documents from - Optional
     * @returns The Documents fetched from the Collection
     */
    fetchDocuments = async (collectionId: string, queries?: string[], databaseId?: string) => {

        //Attempt to Fetch Documents
        try {
            //Fetch Documents using AppWrite SDK
            const documents = await databases.listDocuments(databaseId ?? envDatabaseId, collectionId, queries ?? []);

            //Return Documents
            return documents;

        } catch {
            //Return Null
            return null;
        }
    };

    /**
     * Fetch Document by ID
     * @param collectionId - The ID of the Collection to fetch the Document from
     * @param documentId - The ID of the Document to fetch
     * @param databaseId - The ID of the Database to fetch the Document from - Optional
     * @returns The Document fetched from the Collection
     */
    fetchDocumentById = async (collectionId: string, documentId: string, databaseId?: string) => {

        //Attempt to Fetch Document
        try {
            //Fetch Document using AppWrite SDK
            const document = await databases.getDocument(databaseId ?? envDatabaseId, collectionId, documentId);

            //Return Document
            return document;
        } catch (error) {
            //Log Error with more details
            console.error('Error Fetching Document:', {
                collectionId,
                documentId,
                databaseId: databaseId ?? envDatabaseId,
                error
            });

            //Return null instead of undefined
            return null;
        }
    }

    /**
     * Create Document
     * @param collectionId - The ID of the Collection to create the Document in
     * @param data - The Data to create the Document with
     * @param documentId - The ID of the Document to create - Optional (Auto-Generated if not provided)
     * @param permissions - The Permissions to create the Document with - Optional
     * @returns The Document Created
     */
    createDocument = async ({
        databaseId,
        collectionId,
        data,
        documentId,
        permissions,
    }: {
        databaseId?: string,
        collectionId: string,
        data: Record<string, unknown>,
        documentId?: string,
        permissions?: typeof AppWritePermissions,
    }) => {

        //Document ID
        const id = documentId ?? AppWriteHelper.generateRandomAppwriteId();

        //Converted Permissions
        let convertedPermissions: string[] = [];

        //Check Permissions
        if (permissions) {
            //Set Permissions
            convertedPermissions = AppWriteHelper.convertPermissions(permissions);
        }

        //Attempt to Create Document
        try {
            //Create Document using AppWrite SDK
            const document = await databases.createDocument(databaseId ?? envDatabaseId, collectionId, id, data, convertedPermissions);

            //Return Document
            return document;
        } catch (error) {
            //Log Error
            console.error('Error Creating Document:', error);
        }
    }

    /**
     * Update Document
     * @param collectionId - The ID of the Collection to update the Document in
     * @param documentId - The ID of the Document to update
     * @param data - The Data to update the Document with
     * @param permissions - The Permissions to update the Document with - Optional
     * @returns The Document Updated
     */
    updateDocument = async ({
        databaseId,
        collectionId,
        documentId,
        data,
        permissions,
    }: {
        databaseId?: string,
        collectionId: string,
        documentId: string,
        data: Record<string, unknown>,
        permissions?: typeof AppWritePermissions,
    }) => {

        //Attempt to Update Document
        try {
            //Converted Permissions
            let convertedPermissions: string[] = [];

            //Check Permissions
            if (permissions) {
                //Convert Permissions
                convertedPermissions = AppWriteHelper.convertPermissions(permissions);
            }

            //Update Document using AppWrite SDK
            const document = await databases.updateDocument(databaseId ?? envDatabaseId, collectionId, documentId, data, convertedPermissions);

            //Return Document
            return document;
        } catch (error) {
            //Log Error
            console.error('Error Updating Document:', error);
        }
    }

    /**
     * Delete Document
     * @param collectionId - The ID of the Collection to delete the Document from
     * @param documentId - The ID of the Document to delete
     * @returns True if the Document was deleted, False otherwise
     */
    deleteDocument = async ({
        databaseId,
        collectionId,
        documentId,
    }: {
        databaseId?: string,
        collectionId: string,
        documentId: string,
    }): Promise<boolean> => {

        //Attempt to Delete Document    
        try {
            //Delete Document using AppWrite SDK
            await databases.deleteDocument(databaseId ?? envDatabaseId, collectionId, documentId);

            //Return Success
            return true;
        } catch (error) {
            //Log Error
            console.error('Error Deleting Document:', error);

            //Return Error
            return false;
        }
    }
}

//Export Database Manager
export const database = new Database();