//Client-side (Browser) SDK
import {
    Account as ClientAccount,
    Client as ClientSDK,
    Databases as ClientDatabases,
    ID,
    type Models,
    Teams,
    Permission,
    Role,
    Query,
} from "appwrite";

//AppWrite Environment Variables
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const devKey = process.env.NEXT_APPWRITE_DEV_KEY;

//Validate Environment Variables
if (!projectId) throw new Error("Project ID is Not Defined");
if (!endpoint) throw new Error("Endpoint is Not Defined");

//End-User Client (Client - Browser)
const endUserClient = new ClientSDK().setEndpoint(endpoint).setProject(projectId);

//Set Dev Key for Development Environment
if (process.env.NODE_ENV === "development" && devKey) {
    endUserClient.setDevKey(devKey);
}

//APIs for End-Users (Client - Browser)
const account = new ClientAccount(endUserClient);
const databases = new ClientDatabases(endUserClient);
const teams = new Teams(endUserClient);

//Export APIs
export {
    endUserClient as client,
    endUserClient,
    account,
    databases,
    teams,
    ID,
    Permission,
    Role,
    Query,
};

//Export Types
export type { Models };