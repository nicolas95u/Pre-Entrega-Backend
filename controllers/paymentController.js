import stripe from '../config/stripe.config.js';
import logger from '../config/logger.js';

export const initiatePayment = async (req, res) => {
  try {
    console.log(req.body);

    const { amount, currency, productName, productNames } = req.body;

    // Check if amount and currency are correctly provided
    if (!amount || !currency) {
      throw new Error('Amount or currency missing from request');
    }

    // Redondear el valor de `amount` para evitar decimales
    const roundedAmount = Math.round(amount * 100);

    // Determinar el nombre del producto o productos
    const itemName = productName || productNames;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: itemName,  
            },
            unit_amount: roundedAmount,  
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/static/payment_success.html`,
      cancel_url: `${process.env.FRONTEND_URL}/static/payment_cancel.html`,
    });
    

    res.render('stripe', {
      sessionId: session.id,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY
    });

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

    switch (event.type) {
      case 'checkout.session.completed':
        // Manejo de la finalización exitosa del pago
        logger.info('Pago completado con éxito');
        break;
      
      case 'checkout.session.expired':
        // Lógica para manejar sesiones expiradas
        logger.warn('La sesión de pago ha expirado');
        break;
        
      case 'payment_intent.canceled':
        // Lógica para manejar pagos cancelados
        logger.warn('El pago ha sido cancelado');
        break;

      // Otros eventos que quieras manejar
      default:
        logger.info(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
