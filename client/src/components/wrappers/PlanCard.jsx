import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { emptyUser } from '../../redux/user';
import { subscriptionService } from '../../services/subscription';
import { getButtonText } from '../../services/utils';

const styles = {
    card: {
        default: {
            border: "border-1 border-gray-700",
            background: "bg-gray-800/30",
            button: "bg-gray-700 hover:bg-gray-600",
            checkmark: "text-gray-400",
            badge: "bg-gray-500"
        },
        popular: {
            border: "border-2 border-emerald-500",
            background: "bg-gray-800/30",
            button: "bg-emerald-500 hover:bg-emerald-600",
            checkmark: "text-emerald-500",
            badge: "bg-emerald-500"
        },
        active: {
            trial: {
                border: "border-2 border-red-500",
                background: "bg-gray-800/30",
                button: "bg-red-500 hover:bg-red-600",
                checkmark: "text-red-500",
                badge: "bg-red-500"
            },
            pro: {
                border: "border-2 border-blue-500",
                background: "bg-gray-800/30",
                button: "bg-blue-500 hover:bg-blue-600",
                checkmark: "text-blue-500",
                badge: "bg-blue-500"
            }
        },
        cancel: {
            button: "text-red-400 hover:text-red-300"
        }
    }
};

const PlanCard = ({
    name,
    price,
    priceId,
    description,
    buttonText,
    features,
    isPopular,
    currentPlan,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isCurrentPlanType = currentPlan?.planType === name.toLowerCase();

    const getCardStyles = () => {
        if (isCurrentPlanType) {
            return currentPlan.status === 'trial' 
                ? styles.card.active.trial 
                : styles.card.active.pro;
        }
        return isPopular ? styles.card.popular : styles.card.default;
    };

    const cardStyles = getCardStyles();

    const handleSubscribe = async () => {
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

    const handleCancelSubscription = async () => {
        if (!currentPlan?.stripeSubscriptionId) return;

        try {
            const confirmed = window.confirm(
                'Are you sure you want to cancel your subscription? Your access will continue until the end of your current billing period.'
            );

            if (confirmed) {
                await subscriptionService.cancelSubscription();
                await fetchSubscriptionStatus(dispatch);
                alert('Your subscription has been cancelled successfully. You will continue to have access until the end of your billing period.');
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

    return (
        <div className={`rounded-xl p-6 flex flex-col relative backdrop-blur-sm ${cardStyles.border}`}>
            {(isPopular || isCurrentPlanType) && (
                <div className={`absolute -top-3 right-6 ${cardStyles.badge} text-xs px-3 py-1 rounded-full`}>
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
                disabled={currentPlan.status === 'active'}
                className={`cursor-pointer w-full py-3 px-4 rounded-lg mb-6 text-center ${cardStyles.button} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {getButtonText(currentPlan, buttonText)}
            </button>
            
            <ul className="space-y-4 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <svg 
                            className={`w-5 h-5 ${cardStyles.checkmark} mr-3 mt-1`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 13l4 4L19 7" 
                            />
                        </svg>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            
            <div className="mt-6 text-sm">
                {isCurrentPlanType && currentPlan.status === 'active' && (
                    <button
                        onClick={handleCancelSubscription}
                        className={`transition-colors duration-200 font-medium cursor-pointer ${styles.card.cancel.button}`}
                    >
                        Cancel your subscription
                    </button>
                )}
            </div>
        </div>
    );
};

export default PlanCard; 