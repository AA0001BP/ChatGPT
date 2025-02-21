export const planConfigs = {
    free: {
      name: "Free",
      price: "0",
      priceId: "price_free",
      description: "Explore how AI can help you with everyday tasks",
      buttonText: "Your current plan",
      buttonStyle: "bg-gray-700 hover:bg-gray-600",
      features: [
        "Access to GPT-4o mini and reasoning",
        "Standard voice mode",
        "Real-time data from the web with search",
        "Limited access to GPT-4o",
        "Limited access to file uploads, advanced data analysis, and image generation",
        "Use custom GPTs"
      ],
      footerText: "Have an existing plan? See",
      footerLink: {
        text: "billing help",
        href: "#"
      }
    },
    plus: {
      name: "Plus",
      price: "20",
      priceId: "price_plus_test",
      description: "Level up productivity and creativity with expanded access",
      buttonText: "Get Plus",
      buttonStyle: "bg-emerald-500 hover:bg-emerald-600",
      isPopular: true,
      checkmarkColor: "text-emerald-500",
      features: [
        "Everything in Free",
        "Extended limits on messaging, file uploads, advanced data analysis, and image generation",
        "Standard and advanced voice mode",
        "Access to multiple reasoning models (o3-mini, o3-mini-high, and o1)",
        "Create and use projects and custom GPTs",
        "Limited access to Sora video generation",
        "Opportunities to test new features"
      ],
      footerText: "Limits apply"
    },
    pro: {
      name: "Pro",
      price: "200",
      priceId: "price_pro_test",
      description: "Get the best of OpenAI with the highest level of access",
      buttonText: "Get Pro",
      buttonStyle: "bg-white text-black hover:bg-gray-300",
      features: [
        "Everything in Plus",
        "Unlimited access to all reasoning models and GPT-4o",
        "Unlimited and advanced voice mode",
        "Access to deep research and o1 pro mode, which uses more compute for the best answers to the hardest questions",
        "Extended access to Sora video generation"
      ],
      footerText: "Unlimited subject to",
      footerLinks: [
        { text: "abuse guardrails.", href: "#" },
        { text: "Learn more", href: "#" }
      ]
    }
  };