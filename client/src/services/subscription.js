// services/subscription.js
import instance from "../config/instance";

export const subscriptionService = {
    createCheckoutSession: async (planType, priceId) => {
        try {
            const response = await instance.post('/api/subscription/create-checkout-session', {
                planType,
                priceId
            });
            console.log("console.log", response)
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getSubscriptionStatus: async () => {
        console.log("reached till here")
        try {
            const response = await instance.get('/api/subscription/status');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};