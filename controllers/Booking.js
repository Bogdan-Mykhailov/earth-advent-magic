import { Tour } from '../models/Tour.js';
import { catchAsync } from '../utils/catchAsync.js';
import { Stripe } from 'stripe';
import { STATUSES } from '../utils/constants.js';

export const getCheckoutSession = catchAsync(async (req, res, next) => {
// 1 get the current booked tour
  const tour = await Tour.findById(req.params.tourId)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// 2 create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
      },
    ],
    mode: 'payment'
  });

// 3 create session as response
  res.status(200).json({
    status: STATUSES.SUCCESS,
    session
  })
})
