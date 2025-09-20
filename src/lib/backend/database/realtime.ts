import { client } from '~/lib/backend/appwrite';

//Realtime Events
enum RealtimeEvents {
    Create = 'create',
    Update = 'update',
    Delete = 'delete'
}

//Subscription Manager
class SubscriptionManager {

    //Subscriptions
    private subscriptions: Map<string, () => void> = new Map();

    /**
     * Add Subscription
     * @param id - The ID of the subscription
     * @param unsubscribeFn - The unsubscribe function
     */
    addSubscription(id: string, unsubscribeFn: () => void) {
        //Add to Subscriptions
        this.subscriptions.set(id, unsubscribeFn);
    }

    /**
     * Remove Subscription
     * @param id - The ID of the subscription
     */
    removeSubscription(id: string) {

        //Unsubscribe Function
        const unsubscribe = this.subscriptions.get(id);

        //If Unsubscribe Function Exists
        if (unsubscribe) {

            //Unsubscribe
            unsubscribe();
        }
    }

    /**
     * Unsubscribe from All Subscriptions
     */
    unsubscribeAll() {

        //Unsubscribe from All Subscriptions
        this.subscriptions.forEach((unsubscribe) => {
            unsubscribe();
        });

        //Clear Subscriptions
        this.subscriptions.clear();
    }

    /**
     * Get Active Count
     * @returns The number of Active Subscriptions
     */
    getActiveCount() {
        return this.subscriptions.size;
    }
}

//Global Subscription Manager
export const subscriptionManager = new SubscriptionManager();

/**
 * Subscribe to Realtime Channel
 * @param collectionId - The ID of the collection to listen to
 * @param callback - The callback function to handle realtime events
 * @param databaseId - The ID of the database (optional, defaults to env variable)
 * @returns The subscription ID for later cleanup
 */
export const subscribeToCollection = async (
    collectionId: string,
    callback: (event: RealtimeEvents, payload: unknown) => void,
    databaseId?: string
) => {

    //Database ID
    const dbId = databaseId || process.env.NEXT_APPWRITE_DATABASE_ID || 'main';

    //Channel
    const channel = `databases.${dbId}.collections.${collectionId}.documents`;

    //Unique Subscription ID
    const subscriptionId = `${dbId}.${collectionId}`;

    //Subscribe to Realtime Events
    const unsubscribe = client.subscribe(channel, (response) => {

        //Attempt to Process Event
        try {
            //Event Type
            const eventType = response.events[0]?.split('.').pop();

            //Payload
            const payload = response.payload;

            //Check if Event Type is Valid
            if (eventType && (Object.values(RealtimeEvents) as string[]).includes(eventType)) {
                //Callback
                callback(eventType as RealtimeEvents, payload);
            } else {
                //Log Warning
                console.warn(`Realtime: Unknown Event Type Received: ${eventType}`, response);
            }
        } catch (error) {
            //Log Error
            console.info('Realtime: Error processing event:', error, response);
        }
    });

    //Add to Global Manager
    subscriptionManager.addSubscription(subscriptionId, unsubscribe);

    //Return Subscription ID for Manual Cleanup
    return subscriptionId;
};

/**
 * Unsubscribe from a specific collection
 * @param subscriptionId - The subscription ID returned from subscribeToCollection
 */
export const unsubscribeFromCollection = async (subscriptionId: string) => {

    //Remove Subscription
    subscriptionManager.removeSubscription(subscriptionId);
};

/**
 * Unsubscribe from all active subscriptions
 */
export const unsubscribeFromAll = async () => {

    //Unsubscribe from All Active Subscriptions
    subscriptionManager.unsubscribeAll();
};