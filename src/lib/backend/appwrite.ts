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

//Server-side (Admin) SDK
import {
    Account as ServerAccount,
    Client as ServerClient,
    Databases as ServerDatabases,
    Teams as ServerTeams,
    Users as ServerUsers,
} from "node-appwrite";

//AppWrite Environment Variables
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const devKey = process.env.NEXT_PUBLIC_APPWRITE_DEV_KEY || process.env.NEXT_APPWRITE_DEV_KEY;
const adminDocsKey = process.env.NEXT_APPWRITE_ADMIN_DOCS_KEY;
const adminUsersKey = process.env.NEXT_APPWRITE_ADMIN_USERS_KEY;

//Validate Environment Variables
if (!projectId) throw new Error("Project ID is Not Defined");
if (!endpoint) throw new Error("Endpoint is Not Defined");

//End-User Client (Client - Browser)
const endUserClient = new ClientSDK().setEndpoint(endpoint).setProject(projectId);

//Set Dev Key for Development Environment
if (process.env.NODE_ENV === "development" && devKey) {
    endUserClient.setDevKey(devKey);
}

//Admin Clients (Server)
const adminClientGeneral = new ServerClient().setEndpoint(endpoint).setProject(projectId);
const adminClientDocs = new ServerClient().setEndpoint(endpoint).setProject(projectId);
const adminClientUsers = new ServerClient().setEndpoint(endpoint).setProject(projectId);

//Set Admin Docs Key for Admin Features (Docs)
if (adminDocsKey) {
    adminClientDocs.setKey(adminDocsKey);
}

//Set Admin Users Key for Admin Features (Users)
if (adminUsersKey) {
    adminClientUsers.setKey(adminUsersKey);
}

//APIs for End-Users (Client - Browser)
const account = new ClientAccount(endUserClient);
const databases = new ClientDatabases(endUserClient);
const teams = new Teams(endUserClient);

//APIs for Admins (Server)
const adminAccount = new ServerAccount(adminClientGeneral);
const adminTeams = new ServerTeams(adminClientGeneral);
const adminDatabases = new ServerDatabases(adminClientDocs);
const adminUsers = new ServerUsers(adminClientUsers);

//Export APIs
export {
    endUserClient as client,
    endUserClient,
    account,
    databases,
    teams,
    adminClientGeneral as adminClient,
    adminAccount,
    adminDatabases,
    adminTeams,
    adminUsers,
    adminDocsKey,
    ID,
    Permission,
    Role,
    Query,
};

//Export Types
export type { Models };