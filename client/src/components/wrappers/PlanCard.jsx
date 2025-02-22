// components/wrappers/PlanCard.jsx
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { emptyUser } from '../../redux/user';
import { subscriptionService } from '../../services/subscription';

const PlanCard = ({
    name,
    price,
    priceId,
    description,
    buttonText,
    buttonStyle,
    features,
    footerText,
    footerLink,
    isPopular,
    isCurrentPlan
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubscribe = async () => {
        if (isCurrentPlan) {
            alert("You are already subscribed to this plan");
            return
        };

        try {
            const response = await subscriptionService.createCheckoutSession(
                name.toLowerCase(),
                priceId
            );

            if (response.data?.id) {
                // For testing, just log and navigate
                console.log('Subscription session created:', response.data);
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
            {(isPopular || isCurrentPlan) && (
                <div className={`absolute -top-3 right-6  ${isCurrentPlan ? 'bg-orange-500' : 'bg-emerald-500'} text-xs px-3 py-1 rounded-full`}>
                    {isCurrentPlan ? 'Active' : 'Popular'}
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
                className={`cursor-pointer w-full py-3 px-4 rounded-lg mb-6 text-center ${isPopular ? 'bg-emerald-500 hover:bg-emerald-600' : isCurrentPlan ? 'bg-gray-700 hover:bg-gray-600' : buttonStyle}`}
            >
                {isCurrentPlan ? 'Current Active Plan' : buttonText}
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
            {footerText && (
                <div className="mt-6 text-sm text-gray-400">
                    {footerText}
                    {footerLink && (
                        <a href={footerLink.href} className="underline ml-1">
                            {footerLink.text}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlanCard;