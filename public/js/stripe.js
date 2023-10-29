'use strict';
// import { Stripe } from 'stripe';
import axios from 'axios';
import { STATUSES } from '../../utils/constants.js';
import { showAlert } from './alerts.js';

// const stripe = new Stripe(process.env.STRIPE_PUBLIC_KEY)

export const bookTour = async (tourId) => {
  try {
    const session = await axios(`http://localhost:8080/api/v1/bookings/checkout-session/${tourId}`)
    console.log(session);

    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id
    // })

    window.location.replace(session.data.session.url);
  } catch (err) {
    showAlert(STATUSES.ERROR, err)
  }
}
