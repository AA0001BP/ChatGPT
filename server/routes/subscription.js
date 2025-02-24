import { Router } from "express";
import express from 'express';
import stripe from 'stripe';
import jwt from 'jsonwebtoken';
import subscriptionHelper from '../helpers/subscription.js';
import sendMail from '../mail/send.js';
import user from "../helpers/user.js";
import fs from 'fs';
import path from 'path';

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();

const sendSubscriptionEmail = (session) => {
    fs.readFile(`${path.resolve(path.dirname(''))}/mail/subscription_templater.html`, 'utf8', (err, html) => {
        if (!err) {
            html = html.replace('[TITLE]', 'Subscription Confirmed');
            html = html.replace('[CONTENT]', `Your ${session.metadata.planType} plan subscription has been activated successfully.`);
            html = html.replace('[BTN_NAME]', 'Start Using EssayAI');
            html = html.replace('[URL]', `${process.env.SITE_URL}/chat`);

            sendMail({
                to: session.customer_email,
                subject: 'EssayAI - Subscription Confirmed',
                html
            });
        }
    });
};


// Similar to your CheckLogged middleware
const CheckAuth = async (req, res, next) => {
    jwt.verify(req.cookies?.userToken, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
        if (decoded) {
            let userData = null

            try {
                userData = await user.checkUserFound(decoded)
            } catch (err) {
                if (err?.notExists) {
                    res.clearCookie('userToken')
                        .status(405).json({
                            status: 405,
                            message: err?.text
                        })
                } else {
                    res.status(500).json({
                        status: 500,
                        message: err
                    })
                }
            } finally {
                if (userData) {
                    req.user = userData
                    next()
                }
            }

        } else {
            res.status(405).json({
                status: 405,
                message: 'Not Logged'
            })
        }
    })
}

router.get('/health', (req, res) => {
    res.send("subscription api is working fine")
})

// Get current subscription status
router.get('/status', CheckAuth, async (req, res) => {
    try {
        const subscription = await subscriptionHelper.getSubscription(req.user._id);
        res.json({
            status: 200,
            data: subscription
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.text || 'Server error'
        });
    }
});

// Create checkout session
router.post('/create-checkout-session', CheckAuth, async (req, res) => {
    const { userId } = req.body;
    try {
        const { priceId, planType } = req.body;
        // Get existing subscription if any
        const currentSubscription = await subscriptionHelper.getSubscription(userId);

        if (currentSubscription?.status === 'active' && currentSubscription?.planType === planType) {
            return res.status(400).json({
                status: 400,
                message: 'You are already subscribed to this plan'
            });
        }

        const session = await stripeClient.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.SITE_URL}/chat?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.SITE_URL}/pricing`,
            client_reference_id: req.user._id.toString(),
            customer_email: req.user.email,
            metadata: {
                planType,
                userId: req.user._id.toString()
            }
        });
        console.log("session response", session)
        res.json({
            status: 200,
            data: session
        });
    } catch (error) {
        console.log("session error", error)
        res.status(500).json({
            status: 500,
            message: error.message || 'Server error while creating checkout session'
        });
    }
});

// Cancel subscription
router.post('/cancel', CheckAuth, async (req, res) => {
    try {
        const subscription = await subscriptionHelper.getSubscription(req.user._id);

        if (!subscription || subscription.status !== 'active') {
            return res.status(400).json({
                status: 400,
                message: 'No active subscription found'
            });
        }

        // Cancel on Stripe
        await stripeClient.subscriptions.cancel(subscription.stripeSubscriptionId);

        // Update local DB
        await subscriptionHelper.cancelSubscription(req.user._id);

        res.json({
            status: 200,
            message: 'Subscription cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message || 'Server error'
        });
    }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('Webhook signature:', req.headers['stripe-signature']);
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeClient.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log("error",err)
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                await subscriptionHelper.createSubscription({
                    userId: session.metadata.userId,
                    status: 'active',
                    planType: session.metadata.planType,
                    stripeCustomerId: session.customer,
                    stripeSubscriptionId: session.subscription,
                    currentPeriodEnd: new Date(session.current_period_end * 1000)
                });

                sendSubscriptionEmail(session);
                break;
            }

            case 'invoice.payment_failed': {
                const subscription = event.data.object;
                await subscriptionHelper.updateSubscriptionStatus(
                    subscription.metadata.userId,
                    'past_due'
                );
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await subscriptionHelper.updateSubscriptionStatus(
                    subscription.metadata.userId,
                    'cancelled'
                );
                break;
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).end();
    }
});

// Get subscription history
router.get('/history', CheckAuth, async (req, res) => {
    try {
        const history = await subscriptionHelper.getSubscriptionHistory(req.user._id);
        res.json({
            status: 200,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.text || 'Server error'
        });
    }
});

export default router;