import React from 'react';

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
    footerLinks,
    isPopular,
    checkmarkColor = "text-gray-400"
}) => {
    return (
        <div className={` rounded-xl p-6 flex flex-col relative ${isPopular ? 'border-2 border-emerald-500' : 'border-1 border-white'}`}>
            {isPopular && (
                <div className="absolute -top-3 right-6 bg-emerald-500 text-xs px-3 py-1 rounded-full">
                    POPULAR
                </div>
            )}

            <h3 className="text-xl font-medium mb-2">{name}</h3>
            <div className="flex items-baseline mb-4">
                <span className="text-2xl font-semibold">$</span>
                <span className="text-5xl font-bold">{price}</span>
                <span className="text-gray-400 ml-1">USD/month</span>
            </div>

            <p className="text-gray-300 mb-6">{description}</p>
            <button onClick={() => onSubscribe(name.toLowerCase(), priceId)} className={`cursor-pointer w-full py-3 px-4 rounded-lg mb-6 text-center ${buttonStyle}`}>
                {buttonText}
            </button>

            <ul className="space-y-4 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <svg
                            className={`w-5 h-5 ${checkmarkColor} mr-3 mt-1`}
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

            <div className="mt-6 text-sm text-gray-400">
                {footerText}
                {footerLink && (
                    <a href={footerLink.href} className="underline"> {footerLink.text}</a>
                )}
                {footerLinks && footerLinks.map((link, index) => (
                    <React.Fragment key={index}>
                        <a href={link.href} className="underline text-gray-400">{link.text}</a>
                        {index < footerLinks.length - 1 && " "}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default PlanCard;