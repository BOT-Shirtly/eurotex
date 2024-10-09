import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Loading from "./loading";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

const PaymentForm = (props) => {
  console.log(props);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    hidePostalCode: true, // Hide postal code field if not needed
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsVisible(true);
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create a payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: props?.billingAddress?.name,
        email: props?.billingAddress?.email,
        address: {
          line1: props?.billingAddress?.address,
          line2: "",
          city: props?.billingAddress?.city,
          state: props?.billingAddress?.state,
          postal_code: props?.billingAddress?.postal,
          country: props?.billingAddress?.country,
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsVisible(false);
      setLoading(false);
      return;
    }
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    // Send payment method ID to the server
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/eurotex/createPayment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: userData?.authToken,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: Number(Number(props?.amount).toFixed(2) * 100),
          email: props?.email,
          name: props?.name,
          shippingAddress: props?.shippingAddress,
          billingAddress: props?.billingAddress,
          metadata: props?.metadata,
          orderNumber: props?.orderNumber,
        }),
      }
    );

    const paymentResponse = await response.json();

    if (paymentResponse.status === "succeeded") {
      var orderSubmissionData = {
        ...props?.metadata,
        paymentResponse,
      };
      console.log(orderSubmissionData);

      setIsVisible(false);
      setSuccess(true);
      setError("");
      navigate("/summary", { state: orderSubmissionData });
    } else {
      setIsVisible(false);
      setSuccess(false);
      setError("Payment failed. Please try again.");
    }
    setIsVisible(false);
    setLoading(false);
  };

  return (
    <>
      {isVisible && <Loading />}
      <form onSubmit={handleSubmit} className="mt-5">
        <p className="mt-6 flex justify-center text-sm font-medium text-gray-500">
          <LockClosedIcon
            aria-hidden="true"
            className="mr-1.5 h-5 w-5 text-gray-400"
          />
          Stripe Secure Payment Gateway
        </p>
        <CardElement
          options={cardElementOptions}
          className="border py-4 px-2 mt-2 rounded"
        />
        {loading ? (
          <div
            disabled={loading} // Disable button when loading
            className={`relative mt-4 px-4 py-2 w-full rounded-md inline-flex items-center justify-center text-white bg-themeColor-500 ${
              loading ? "cursor-not-allowed" : ""
            }`}
          >
            <h3 className="mr-2">Processing Payment</h3>
            <svg
              className="animate-spin h-5 w-5 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        ) : (
          <button
            type="submit"
            disabled={!stripe || loading}
            className="mt-5 px-4 py-2 bg-themeColor-600 text-white rounded hover:bg-themeColor-500 w-full"
          >
            Pay ${Number(props?.amount).toFixed(2)}
          </button>
        )}

        {!loading && error && !success && (
          <div className="mt-4 text-red-500">{error}</div>
        )}
        {!loading && success && (
          <div className="mt-4 text-green-500">Payment successful!</div>
        )}
      </form>
    </>
  );
};

export default PaymentForm;
