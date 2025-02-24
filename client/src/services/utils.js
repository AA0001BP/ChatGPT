export const fetchSubscriptionStatus = async (fn) => {
    try {
        const response = await subscriptionService.getSubscriptionStatus();
        if (response.data?.status) {
            setCurrentPlan(response.data);
        }
    } catch (error) {
        if (error?.response?.data?.status === 405) {
            navigate("/login");
        }
        console.error('Error fetching subscription status:', error);
    }
};