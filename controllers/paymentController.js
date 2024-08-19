import Stripe from 'stripe';
import logger from '../config/logger.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const initiatePayment = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Compra en E-commerce',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    logger.error('Error al iniciar el pago:', error);
    res.status(500).json({ error: 'No se pudo iniciar el pago' });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
