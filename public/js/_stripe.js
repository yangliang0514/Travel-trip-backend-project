import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { showAlert } from "./_alerts";

let stripe;

(async function () {
  stripe = await loadStripe(
    "pk_test_51MwT4CH5ICRo9UtMW3563eyo2jsaFpPgf5VTBtI4ProogoxO1B6uOx5YnIC3ARLzdCYmTVlEeTnzJWj7ARB3aHrh00VM4i59nQ"
  );
})();

export async function bookTour(tourId) {
  try {
    // 1. get checkout session from the the api
    const session = await axios(
      `http://127.0.0.1:8080/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2. use the stripe object to create a checkout form + charge the credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert(err.message);
  }
}
