import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { emptyUser } from '../../redux/user';
import { subscriptionService } from '../../services/subscription';
import { getButtonText } from '../../services/utils';

const PlanCard = ({
    name,
    price,
    priceId,
    description,
    buttonText,
    buttonStyle,
    features,
    isPopular,
    currentPlan,
    onSubscriptionUpdate
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const refreshSubscriptionStatus = async () => {
        try {
            const response = await subscriptionService.getSubscriptionStatus();
            if (response.data) {
                onSubscriptionUpdate(response.data);
            }
        } catch (err) {
            if (err?.status === 405) {
                dispatch(emptyUser());
                navigate("/login");
            }
        }
    };

    const handleCancelSubscription = async () => {
        if (!currentPlan?.stripeSubscriptionId) return;

        try {
            const confirmed = window.confirm('Are you sure you want to cancel your subscription? Your access will continue until the end of your current billing period.');

            if (confirmed) {
                await subscriptionService.cancelSubscription();
                alert('Your subscription has been cancelled successfully. You will continue to have access until the end of your billing period.');
                refreshSubscriptionStatus()
            }
        } catch (err) {
            if (err?.status === 405) {
                dispatch(emptyUser());
                navigate("/login");
            } else {
                alert(err?.message || 'Failed to cancel subscription. Please try again.');
            }
        }
    };

    const styles={
        cardTheme: "bg-emerald-500 hover:bg-emerald-600",
    }

    const isCurrentPlanType = currentPlan?.planType === name.toLowerCase();

    const handleSubscribe = async () => {
        if (isCurrentPlanType && currentPlan.status !== 'trial') return;

        try {
            const response = await subscriptionService.createCheckoutSession(
                name.toLowerCase(),
                priceId
            );

            if (response.data?.id) {
                window.location.href = response.data.url;
            }
        } catch (err) {
            if (err?.status === 405) {
                dispatch(emptyUser());
                navigate("/login");
            } else {
                alert(err?.message || 'Subscription failed');
            }
        }
    };

    return (
        <div className={`rounded-xl p-6 flex flex-col relative ${isPopular ? 'border-2 border-emerald-500' : 'border-1 border-white'}`}>
            {(isPopular || isCurrentPlanType) && (
                <div className={`absolute -top-3 right-6 ${isCurrentPlanType
                    ? currentPlan.status === 'trial'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    : 'bg-emerald-500'
                    } text-xs px-3 py-1 rounded-full`}>
                    {isCurrentPlanType
                        ? currentPlan.status === 'trial'
                            ? 'Trial Active'
                            : 'Pro Plan Active'
                        : 'Popular'}
                </div>
            )}
            <h3 className="text-xl font-medium mb-2">{name}</h3>
            <div className="flex items-baseline mb-4">
                <span className="text-2xl font-semibold">£</span>
                <span className="text-5xl font-bold">{price}</span>
                <span className="text-gray-400 ml-1">/month</span>
            </div>
            <p className="text-gray-300 mb-6">{description}</p>
            <button
                onClick={handleSubscribe}
                disabled={isCurrentPlanType && currentPlan.status !== 'trial'}
                className={`cursor-pointer w-full py-3 px-4 rounded-lg mb-6 text-center ${isPopular
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : isCurrentPlanType
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : buttonStyle
                    }`}
            >
                {getButtonText(currentPlan, buttonText)}
            </button>
            <ul className="space-y-4 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <svg className={`w-5 h-5 ${isPopular ? 'text-emerald-500' : 'text-gray-400'} mr-3 mt-1`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            {(
                <div className="mt-6 text-sm">
                    {isCurrentPlanType && currentPlan.status === 'active' && (
                        <button
                            onClick={handleCancelSubscription}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200 font-medium cursor-pointer"
                        >
                            Cancel your subscription
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlanCard;