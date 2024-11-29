import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
// Replace with your actual publishable key from Stripe
var stripePromise=loadStripe("pk_test_51QPzX5ANEArfmUALversOhhWgOYuUBFYq7Y1zC5mmwfSe1e1mkuYtNFeKxjqKajuS63YY0Nj0ziybeO2swMcnecF00OWRRtIvb"); ;

const CheckoutForm = () => {
  const params = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    const res = await fetch(
      `/api/listing/create-payment-intent/${params.amount}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const  apiResponse  = await res.json();
    
    if (apiResponse.clientSecret) {
      // Confirm the PaymentIntent with the card details
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        apiResponse.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setPaymentError(error.message);
        setIsProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful");
        setIsProcessing(false);
        navigate(-2);
      }
    } else {
      setPaymentError("Technical error ocuurd");
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-r from-slate-800 to-slate-600 py-8">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Complete Your Payment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="card-element" className="block text-gray-600">
              Card Details
            </label>
            <div className="border p-4 rounded-md">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </div>
          {paymentError && (
            <div className="text-red-500 text-sm">{paymentError}</div>
          )}
          <button
            disabled={isProcessing || !stripe}
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md focus:outline-none ${
              isProcessing || !stripe ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? "Processing…" : `Pay now Rs.${params.amount}`}
          </button>
        </form>
      </div>
    </main>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentPage;
