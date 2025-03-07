// helpers/subscription.js
import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import { ObjectId } from "mongodb";

export default {
    createSubscription: (subscriptionData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.collection(collections.USER).updateOne(
                    { _id: new ObjectId(subscriptionData.userId) },
                    {
                        $set: {
                            subscription: {
                                status: subscriptionData.status,
                                planType: subscriptionData.planType,
                                stripeCustomerId: subscriptionData.stripeCustomerId,
                                stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
                                planStart: subscriptionData.currentPeriodStart,
                                planEnd: subscriptionData.currentPeriodEnd,
                                isProUser: true,
                                isTrialUser: false,
                                updatedAt: new Date(),
                                hasPaidOnce: true
                            }
                        }
                    }
                );
                resolve(result);
            } catch (err) {
                reject({ text: "DB gets something wrong", error: err });
            }
        });
    },

    getSubscription: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.collection(collections.USER).findOne(
                    { _id: userId },
                    { projection: { subscription: 1 } }
                );
                resolve(result?.subscription || {});
            } catch (err) {
                reject({ text: "DB gets something wrong", error: err });
            }
        });
    },

    updateSubscriptionStatus: (userId, status) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.collection(collections.USER).updateOne(
                    { _id: new ObjectId(userId) },
                    {
                        $set: {
                            "subscription.status": status,
                            "subscription.updatedAt": new Date(),
                            "subscription.isProUser": false
                        }
                    }
                );
                resolve(result);
            } catch (err) {
                reject({ text: "DB gets something wrong", error: err });
            }
        });
    },
    updateSubscription: ({ userId, status, cancelledAt, currentPeriodEnd }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.collection(collections.USER).updateOne(
                    { _id: new ObjectId(userId) },
                    {
                        $set: {
                            "subscription.status": status,
                            "subscription.updatedAt": new Date(),
                            "subscription.isProUser": false,
                            "subscription.cancelledAt": cancelledAt,
                            "subscription.currentPeriodEnd": currentPeriodEnd
                        }
                    }
                );
                resolve(result);
            } catch (err) {
                reject({ text: "DB gets something wrong", error: err });
            }
        });
    },

    cancelSubscription: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.collection(collections.USER).updateOne(
                    { _id: new ObjectId(userId) },
                    {
                        $set: {
                            "subscription.status": "cancelled",
                            "subscription.cancelledAt": new Date(),
                            "subscription.isProUser": false
                        }
                    }
                );
                resolve(result);
            } catch (err) {
                reject({ text: "DB gets something wrong", error: err });
            }
        });
    },

    getSubscriptionHistory: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.collection(collections.USER).aggregate([
                    {
                        $match: { _id: new ObjectId(userId) }
                    },
                    {
                        $project: {
                            _id: 0,
                            subscription: 1
                        }
                    }
                ]).toArray();
                resolve(result[0]?.subscription || null);
            } catch (err) {
                reject({ text: "DB gets something wrong", error: err });
            }
        });
    },

    checkFeatureAccess: (subscription, feature) => {
        const featureAccess = {
            free: ['basic_chat'],
            plus: ['basic_chat', 'voice', 'file_upload', 'advanced_data_analysis'],
            pro: ['basic_chat', 'voice', 'file_upload', 'advanced_data_analysis', 'advanced_models', 'sora']
        };

        return subscription &&
            subscription.status === 'active' &&
            featureAccess[subscription.planType]?.includes(feature);
    }
};