import { setCurrentPlan } from "../redux/subscription";
import { subscriptionService } from "./subscription";

export const fetchSubscriptionStatus = async (dispatch) => {
    try {
        const response = await subscriptionService.getSubscriptionStatus();
        if (response.data?.status) {
            dispatch(setCurrentPlan(response.data));
        }
    } catch (error) {
        if (error?.response?.data?.status === 405) {
            navigate("/login");
        }
        console.error('Error fetching subscription status:', error);
    }
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        // weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const getButtonText = (currentPlan, buttonText) => {
    if (!currentPlan) return buttonText;
    if (currentPlan.status === 'trial') {
        return `Trial ends on ${formatDate(currentPlan.trialEnd)} - Upgrade to Pro`;
    }
    else if (currentPlan.status === 'active') {
        return `Plan active until ${formatDate(currentPlan.planEnd)}`;
    }
    else if (currentPlan.status === 'expired' && !currentPlan.hasPaidOnce) {
        return `Trial was expired on ${formatDate(currentPlan.trialEnd)} - Upgrade to Pro`;
    }
    else if (currentPlan.status === 'expired' && currentPlan.hasPaidOnce) {
        return `Your Plan was expired on ${formatDate(currentPlan.planEnd)} - Upgrade to Pro`;
    }
    else if (currentPlan.status === 'cancelled' && new Date(currentPlan.planEnd) > new Date()) {
        return `Your Plan will expire on ${formatDate(currentPlan.planEnd)} - Upgrade to Pro`;
    }
    return buttonText;
};