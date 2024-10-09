import {
  Disclosure,
  DisclosureButton,
  Radio,
  RadioGroup,
  DisclosurePanel,
} from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/loading";
import { ToastContainer, toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "components/paymentForm";
const stripePromise = loadStripe("pk_live_2A5OIadpFOD6WtdZF5FVVKqY00mLbkVFM9");

const provinces = [
  "",
  "AB-Alberta",
  "BC-British Columbia",
  "MB-Manitoba",
  "NB-New Brunswick",
  "NL-Newfoundland and Labrador",
  "NS-Nova Scotia",
  "ON-Ontario",
  "PE-Prince Edward Island",
  "QC-Quebec",
  "SK-Saskatchewan",
  "NT-Northwest Territories",
  "NU-Nunavut",
  "YT-Yukon",
];

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0.0);
  const [shippingCost, setShippingCost] = useState(0.0);
  const [shippingService, setShippingService] = useState("");
  const [taxEstimate, setTaxEstimate] = useState(0.0);
  const [orderTotal, setOrderTotal] = useState(0.0);
  const [sameBillingShipping, setSameBillingShipping] = useState(true);
  const [deliveryMethods, setDeliveryMethods] = useState([
    {
      id: 1,
      title: "UPS Standard",
      turnaround: "4–10 business days",
      price: 0,
    },
    {
      id: 2,
      title: "Store Pick-up",
      turnaround: "2–5 business days",
    },
  ]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods[0]
  );
  const [totalWeight, setTotalWeight] = useState(0.0);
  const [orderNumber, setOrderNumber] = useState(
    Math.floor(100000 + Math.random() * 900000)
  );
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postal: "",
    country: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postal: "",
    country: "",
  });
  const handleBillingInputChange = (event) => {
    const { name, value } = event.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value,
    });

    if (sameBillingShipping) {
      setShippingAddress({
        ...billingAddress,
        [name]: value,
      });
    }
  };
  const handleShippingInputChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };

  useEffect(() => {
    if (sameBillingShipping) {
      setShippingAddress(billingAddress);
    }
  }, [sameBillingShipping]);
  useEffect(() => {
    if (sameBillingShipping) {
      setShippingAddress(billingAddress);
    }
  }, [billingAddress]);

  useEffect(() => {
    if (selectedDeliveryMethod?.title == "Store Pick-up") {
      setShippingCost(0.0);
    } else {
      getShippingRate();
    }
  }, [selectedDeliveryMethod]);
  useEffect(() => {
    var userData = localStorage.getItem("__EurotexUser__");
    if (userData) {
      setIsVisible(true);
      var userToken = JSON.parse(userData);
      setBillingAddress({
        ...billingAddress,
        email: userToken?.email,
        country: "CA",
        name: userToken?.name,
      });
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/eurotex/cart`, {
          headers: {
            authorization: userToken?.authToken, // Replace with your actual token
          },
        })
        .then((response) => {
          if (response.data.success == undefined) {
            setIsVisible(false);
            setProducts(response.data);
            const subTotal1 = response.data.reduce((total, item) => {
              return (
                total +
                Number(item?.orderedCombination?.price) *
                  Number(item?.orderedCombination?.qty)
              );
            }, 0);
            setSubTotal(Number(subTotal1).toFixed(2));
            setTaxEstimate(
              Number(
                ((Number(subTotal1) + Number(shippingCost)) * 13) / 100
              ).toFixed(2)
            );
            setOrderTotal(
              Number(
                subTotal1 + Number((Number(subTotal1) * 13) / 100)
              ).toFixed(2)
            );
            const totalWeight = response?.data?.reduce((total, item) => {
              const { qty, weightInPounds } = item?.orderedCombination;
              return total + qty * weightInPounds;
            }, 0);
            setTotalWeight(Number(totalWeight).toFixed(2));
            if (totalWeight > 149) {
              deliveryMethods.push({
                id: 4,
                title: "Freight shipping",
                turnaround: "5–10 business days",
                price: 0,
              });
              setDeliveryMethods(deliveryMethods);
              setSelectedDeliveryMethod(
                deliveryMethods[deliveryMethods.length - 1]
              );
            }
          } else {
            toast.error(response.data.message, {
              position: "bottom-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setIsVisible(false);
            localStorage.removeItem("__EurotexUser__");
            window.location.replace("/");
          }
        })
        .catch((error) => {
          toast.error("Error, please try again later!!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsVisible(false);
          localStorage.removeItem("__EurotexUser__");
          window.location.replace("/");
        });
    }
  }, []);
  useEffect(() => {
    setTaxEstimate(
      Number((Number(Number(subTotal) + shippingCost) * 13) / 100).toFixed(2)
    );
    setOrderTotal(
      Number(
        Number(subTotal) +
          shippingCost +
          Number((Number(Number(subTotal) + shippingCost) * 13) / 100)
      ).toFixed(2)
    );
  }, [shippingCost]);
  const deleteCartItem = (product) => {
    setIsVisible(true);
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/eurotex/cart?combination=${product?.orderedCombination?.name}`,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Updated.", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsVisible(false);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error(response.data.message, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsVisible(false);
          localStorage.removeItem("__EurotexUser__");
          window.location.replace("/");
        }
      })
      .catch((error) => {
        toast.error("Error, please try again later!!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsVisible(false);
        localStorage.removeItem("__EurotexUser__");
        window.location.replace("/");
      });
  };
  const getShippingRate = () => {
    if (shippingAddress?.state && shippingAddress.country && totalWeight) {
      setIsVisible(true);
      setLoading(true);
      var userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/eurotex/getRates?shipToState=${
            shippingAddress?.state?.split("-")[0]
          }&shipToCountry=${shippingAddress.country}&postalCode=${
            shippingAddress.postal
          }&weightPounds=${Number(totalWeight).toString()}`,
          {
            headers: {
              authorization: userData?.authToken, // Replace with your actual token
            },
          }
        )
        .then((response) => {
          if (response.data.success == undefined) {
            setLoading(false);
            setIsVisible(false);
            const updatedOptions = [...deliveryMethods];
            for (var i = 0; i < response?.data?.length; i++) {
              var serviceName = response?.data[i]?.serviceName;
              for (var j = 0; j < updatedOptions?.length; j++) {
                if (updatedOptions[j]?.title == serviceName) {
                  updatedOptions[j].price = response?.data[i]?.total;
                }
              }
            }
            setDeliveryMethods(updatedOptions);
            setShippingCost(selectedDeliveryMethod?.price);
            setShippingService(selectedDeliveryMethod?.title);
          } else {
            setLoading(false);
            setIsVisible(false);
            localStorage.removeItem("__EurotexUser__");
            window.location.replace("/");
          }
        })
        .catch((error) => {
          setLoading(false);
          setIsVisible(false);
        });
    }
  };
  return (
    <>
      {isVisible && <Loading />}
      <main className="lg:flex lg:min-h-full lg:flex-row-reverse lg:overflow-hidden mx-auto max-w-2xl lg:max-w-7xl">
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* Mobile order summary */}
        <section
          aria-labelledby="order-heading"
          className="bg-gray-50 px-4 py-6 sm:px-6 lg:hidden"
        >
          <Disclosure as="div" className="mx-auto max-w-lg">
            <div className="flex items-center justify-between">
              <h2
                id="order-heading"
                className="text-lg font-medium text-gray-900"
              >
                Your Order
              </h2>
              <DisclosureButton className="group font-medium text-themeColor-600 hover:text-themeColor-500">
                <span className="[.group:not([data-open])_&]:hidden">
                  Hide full summary
                </span>
                <span className="group-data-[open]:hidden">
                  Show full summary
                </span>
              </DisclosureButton>
            </div>

            <DisclosurePanel>
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-gray-200"
              >
                {products?.map((product) => (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <img
                      alt={product.imageAlt}
                      src={product.imageSrc}
                      className="h-40 w-40 flex-none rounded-md bg-gray-200 object-cover object-center"
                    />
                    <div className="flex flex-col justify-between space-y-4">
                      <div className="space-y-1 text-sm font-medium">
                        <h3 className="text-gray-900">{product.name}</h3>
                        <p className="text-gray-500 text-xs">
                          {product.orderedCombination.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          QTY: {product.orderedCombination.qty}
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <a
                          href="/cart"
                          type="button"
                          className="text-sm font-medium text-themeColor-600 hover:text-themeColor-500"
                        >
                          Edit
                        </a>
                        <div className="flex border-l border-gray-300 pl-4">
                          <button
                            onClick={() => {
                              deleteCartItem(product);
                            }}
                            type="button"
                            className="text-sm font-medium text-themeColor-600 hover:text-themeColor-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
                <div className="flex justify-between">
                  <dt>Weight (pounds)</dt>
                  <dd className="text-gray-900">{totalWeight}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">${subTotal}</dd>
                </div>
                {shippingCost === 0 && !loading ? (
                  <div className="rounded-md bg-yellow-50 p-4 mt-4 text-left">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-yellow-400"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Shipping
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>Please enter correct postal code or provience.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {loading ? (
                  <div
                    disabled={loading} // Disable button when loading
                    className={`relative w-full rounded-md inline-flex items-center justify-center px-4 py-2 font-semibold text-white bg-themeColor-500 hover:bg-themeColor-600 focus:outline-none focus:ring-2 focus:ring-themeColor-400 focus:ring-offset-2 ${
                      loading ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <h3 className="text-sm font-medium text-white-800 mr-2">
                      Calculating Shipping
                    </h3>
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
                ) : null}
                {!loading && shippingCost !== 0 ? (
                  <div className="flex justify-between">
                    <dt>
                      Shipping&nbsp;
                      <span className="text-gray-500 text-xs">
                        ({shippingService})
                      </span>
                    </dt>
                    <dd className="text-gray-900">${shippingCost}</dd>
                  </div>
                ) : null}

                <div className="flex justify-between">
                  <dt>Taxes</dt>
                  <dd className="text-gray-900">${taxEstimate}</dd>
                </div>
              </dl>
            </DisclosurePanel>

            <p className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 text-sm font-medium text-gray-900">
              <span className="text-base">Total</span>
              <span className="text-base">${orderTotal}</span>
            </p>
          </Disclosure>
        </section>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="hidden w-full max-w-md flex-col bg-gray-50 lg:flex"
        >
          <h2 id="summary-heading" className="mt-4 px-6">
            Order summary
          </h2>

          <ul
            role="list"
            className="flex-auto divide-y divide-gray-200 overflow-y-auto px-6"
          >
            {products?.length > 0 ? (
              products?.map((product) => (
                <li key={product.id} className="flex space-x-6 py-6">
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc}
                    className="h-40 w-40 flex-none rounded-md bg-gray-0 object-cover object-center"
                  />
                  <div className="flex flex-col justify-between space-y-4">
                    <div className="space-y-1 text-sm font-medium">
                      <h3 className="text-gray-900">{product.name}</h3>
                      <p className="text-gray-500 text-xs">
                        {product.orderedCombination.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        QTY: {product.orderedCombination.qty}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <a
                        href="/cart"
                        type="button"
                        className="text-sm font-medium text-themeColor-600 hover:text-themeColor-500"
                      >
                        Edit
                      </a>
                      <div className="flex border-l border-gray-300 pl-4">
                        <button
                          onClick={() => {
                            deleteCartItem(product);
                          }}
                          type="button"
                          className="text-sm font-medium text-themeColor-600 hover:text-themeColor-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <a
                href="/products"
                type="button"
                className="mt-5 relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-themeColor-500 focus:ring-offset-2"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  className="mx-auto h-12 w-12 text-gray-400"
                >
                  <path
                    d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Add Products to Cart
                </span>
              </a>
            )}
          </ul>

          <div className="sticky bottom-0 flex-none border-t border-gray-200 bg-gray-50 p-6">
            <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
              <div className="flex justify-between">
                <dt>Weight (pounds)</dt>
                <dd className="text-gray-900">{totalWeight}</dd>
              </div>
              {/* {totalWeight > 149 &&
              selectedDeliveryMethod?.title != "Store Pick-up" ? (
                <div className="rounded-md bg-red-50 p-4 mt-4 text-left relative border">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-red-400"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Exceed Weight Limit
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          Due to shipping restrictions, orders exceeding a total
                          weight of 149 pounds will require special
                          arrangements.
                        </p>
                        <p className="mt-2">
                          Please select one of the following options:
                        </p>
                        <ul className="mt-2">
                          <li>"Frieght Shipping Option"</li>
                          <li>"Store Pick-up"</li>
                        </ul>
                        <p className="mt-2">
                          Freight shipping for bulk orders is invoiced
                          separately after purchase. Prepayment is required
                          before shipping can be arranged.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null} */}

              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-gray-900">${subTotal}</dd>
              </div>
              {shippingCost === 0 &&
              !loading &&
              selectedDeliveryMethod?.title != "Store Pick-up" &&
              selectedDeliveryMethod?.title != "Freight shipping" ? (
                <div className="rounded-md bg-yellow-50 p-4 mt-4 text-left relative border">
                  <button
                    onClick={getShippingRate}
                    type="submit"
                    className="absolute top-1 right-1 rounded-md border border-transparent bg-yellow-600 px-1 py-1 text-xs text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    Refresh
                  </button>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-yellow-400"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Shipping
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Please enter correct postal code or provience.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {loading ? (
                <div
                  disabled={loading} // Disable button when loading
                  className={`relative w-full rounded-md inline-flex items-center justify-center px-4 py-2 font-semibold text-white bg-themeColor-500 hover:bg-themeColor-600 focus:outline-none focus:ring-2 focus:ring-themeColor-400 focus:ring-offset-2 ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                >
                  <h3 className="text-sm font-medium text-white-800 mr-2">
                    Calculating Shipping
                  </h3>
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
              ) : null}
              {!loading && shippingCost !== 0 ? (
                <div className="flex justify-between">
                  <dt>
                    Shipping&nbsp;
                    <span className="text-gray-500 text-xs">
                      ({shippingService})
                    </span>
                  </dt>
                  <dd className="text-gray-900">${shippingCost}</dd>
                </div>
              ) : null}
              {selectedDeliveryMethod?.title == "Store Pick-up" ? (
                <div className="flex justify-between">
                  <dt>
                    Shipping&nbsp;
                    <span className="text-gray-500 text-xs">
                      (Store Pick-up)
                    </span>
                  </dt>
                  <dd className="text-gray-900">${shippingCost}</dd>
                </div>
              ) : null}

              <div className="flex justify-between">
                <dt>Taxes</dt>
                <dd className="text-gray-900">${taxEstimate}</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                <dt className="text-base">Total</dt>
                <dd className="text-base">${orderTotal}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Checkout form */}
        <section
          aria-labelledby="payment-heading"
          className="flex-auto overflow-y-auto px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-12"
        >
          <div className="mx-auto max-w-lg">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Checkout
            </h1>
            <div className="mt-5 relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
                  Billing Address
                </span>
              </div>
            </div>

            <div className="mt-5">
              <div className="grid grid-cols-12 gap-x-4 gap-y-6">
                <div className="col-span-full">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={billingAddress.name}
                      onChange={handleBillingInputChange}
                      autoComplete="name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={billingAddress.email}
                      onChange={handleBillingInputChange}
                      autoComplete="email"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="address"
                      name="address"
                      value={billingAddress.address}
                      onChange={handleBillingInputChange}
                      type="text"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="col-span-full sm:col-span-4">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      id="city"
                      name="city"
                      value={billingAddress.city}
                      onChange={handleBillingInputChange}
                      type="text"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-full sm:col-span-4">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Province
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={billingAddress.state}
                    onChange={handleBillingInputChange}
                    onBlur={() => {
                      if (sameBillingShipping) {
                        getShippingRate();
                      }
                    }}
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                  >
                    {provinces.map((province, index) => (
                      <option key={index} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-full sm:col-span-4">
                  <label
                    htmlFor="postal"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      id="postal"
                      name="postal"
                      value={billingAddress.postal}
                      onChange={handleBillingInputChange}
                      onBlur={() => {
                        if (sameBillingShipping) {
                          getShippingRate();
                        }
                      }}
                      type="text"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <div className="mt-1">
                    <input
                      id="country"
                      name="country"
                      disabled
                      value={billingAddress.country}
                      type="text"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div
                className="mt-6 flex space-x-2 cursor-pointer"
                onClick={() => {
                  setSameBillingShipping(!sameBillingShipping);
                }}
              >
                <div
                  className="flex h-5 items-center cursor-pointer"
                  onClick={() => {
                    setSameBillingShipping(!sameBillingShipping);
                  }}
                >
                  <input
                    onClick={() => {
                      setSameBillingShipping(!sameBillingShipping);
                    }}
                    checked={sameBillingShipping}
                    id="same-as-shipping"
                    name="same-as-shipping"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-themeColor-600 focus:ring-themeColor-500"
                  />
                </div>
                <a
                  onClick={() => {
                    setSameBillingShipping(!sameBillingShipping);
                  }}
                  htmlFor="same-as-shipping"
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Billing address is the same as shipping address
                </a>
              </div>
            </div>
            {!sameBillingShipping ? (
              <>
                <div className="mt-5 relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
                      Shipping Address
                    </span>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="grid grid-cols-12 gap-x-4 gap-y-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <div className="mt-1">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={shippingAddress.name}
                          onChange={handleShippingInputChange}
                          autoComplete="name"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <div className="mt-1">
                        <input
                          id="address"
                          disabled={sameBillingShipping}
                          name="address"
                          value={shippingAddress.address}
                          onChange={handleShippingInputChange}
                          type="text"
                          autoComplete="street-address"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="col-span-full sm:col-span-4">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <div className="mt-1">
                        <input
                          id="city"
                          disabled={sameBillingShipping}
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleShippingInputChange}
                          type="text"
                          autoComplete="address-level2"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="col-span-full sm:col-span-4">
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Province
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onBlur={getShippingRate}
                        onChange={handleShippingInputChange}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                      >
                        {provinces.map((province, index) => (
                          <option key={index} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-full sm:col-span-4">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Postal code
                      </label>
                      <div className="mt-1">
                        <input
                          id="postal"
                          name="postal"
                          disabled={sameBillingShipping}
                          value={shippingAddress.postal}
                          onBlur={getShippingRate}
                          onChange={handleShippingInputChange}
                          type="text"
                          autoComplete="postal-code"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <div className="mt-1">
                        <input
                          id="country"
                          name="country"
                          disabled
                          value={billingAddress.country}
                          type="text"
                          autoComplete="street-address"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-themeColor-500 focus:ring-themeColor-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            <div className="mt-5 relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
                  Shipping Options
                </span>
              </div>
            </div>

            <div className="mt-5">
              <fieldset aria-label="Delivery method" className="mt-4">
                <RadioGroup
                  value={selectedDeliveryMethod}
                  onChange={setSelectedDeliveryMethod}
                  className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
                >
                  {deliveryMethods.map((deliveryMethod) => (
                    <Radio
                      key={deliveryMethod.id}
                      value={deliveryMethod}
                      aria-label={deliveryMethod.title}
                      aria-description={`${deliveryMethod.turnaround} for ${deliveryMethod.price}`}
                      className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-themeColor-500"
                    >
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">
                            {deliveryMethod.title}
                          </span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            {deliveryMethod.turnaround}
                          </span>
                          {deliveryMethod?.price != undefined ? (
                            <span className="mt-6 text-sm font-medium text-gray-900">
                              ${deliveryMethod.price}
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-themeColor-600 [.group:not([data-checked])_&]:hidden"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-themeColor-500"
                      />
                    </Radio>
                  ))}
                </RadioGroup>
              </fieldset>
            </div>

            {selectedDeliveryMethod?.title == "Store Pick-up" ? (
              <>
                <div className="mt-5 relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
                      Pick-up Address
                    </span>
                  </div>
                </div>
                <div className="rounded-md bg-yellow-50 p-4 mt-4 text-left relative border">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-yellow-400"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Pick-up Address
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          122 Middleton Street
                          <br />
                          Brantfor N3S7V7 ON
                          <br />
                          Canada
                        </p>
                      </div>
                      <h3 className="text-sm font-medium text-yellow-800 mt-2">
                        Note: You will receive an email confirmation once order
                        is ready for pickup.
                      </h3>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            <div className="mt-5 relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
                  Payment Details
                </span>
              </div>
            </div>

            {billingAddress.name &&
            billingAddress.email &&
            billingAddress.address &&
            billingAddress.city &&
            billingAddress.state &&
            billingAddress.postal &&
            billingAddress.country &&
            shippingAddress.name &&
            shippingAddress.email &&
            shippingAddress.address &&
            shippingAddress.city &&
            shippingAddress.state &&
            shippingAddress.postal &&
            shippingAddress.country &&
            totalWeight <= 149 &&
            shippingCost > 0 &&
            !loading &&
            orderTotal > 0 ? (
              <Elements stripe={stripePromise} className="mt-5">
                <PaymentForm
                  amount={orderTotal}
                  email={billingAddress.email}
                  name={billingAddress.name}
                  shippingAddress={shippingAddress}
                  billingAddress={billingAddress}
                  metadata={{
                    orderNumber,
                    orderedItems: products,
                    billingAddress,
                    shippingAddress,
                    sameBillingShipping,
                    shippingService,
                    selectedDeliveryMethod,
                    paymentDetails: {
                      subTotal: Number(subTotal),
                      taxEstimate: Number(taxEstimate),
                      orderTotal: Number(orderTotal),
                      totalWeight: Number(totalWeight),
                      shippingCost: Number(shippingCost),
                    },
                  }}
                  orderNumber={orderNumber}
                />
              </Elements>
            ) : billingAddress.name &&
              billingAddress.email &&
              billingAddress.address &&
              billingAddress.city &&
              billingAddress.state &&
              billingAddress.postal &&
              billingAddress.country &&
              shippingAddress.name &&
              shippingAddress.email &&
              shippingAddress.address &&
              shippingAddress.city &&
              shippingAddress.state &&
              shippingAddress.postal &&
              shippingAddress.country &&
              !loading &&
              orderTotal > 0 &&
              totalWeight > 149 ? (
              <Elements stripe={stripePromise} className="mt-5">
                <PaymentForm
                  amount={orderTotal}
                  email={billingAddress.email}
                  name={billingAddress.name}
                  shippingAddress={shippingAddress}
                  billingAddress={billingAddress}
                  metadata={{
                    orderNumber,
                    orderedItems: products,
                    billingAddress,
                    shippingAddress,
                    sameBillingShipping,
                    shippingService,
                    selectedDeliveryMethod,
                    paymentDetails: {
                      subTotal: Number(subTotal),
                      taxEstimate: Number(taxEstimate),
                      orderTotal: Number(orderTotal),
                      totalWeight: Number(totalWeight),
                      shippingCost: Number(shippingCost),
                    },
                  }}
                  orderNumber={orderNumber}
                />
              </Elements>
            ) : (
              <div className="rounded-md bg-red-50 p-4 mt-4 text-left relative border">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-red-400"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Incorrect Information
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p className="mt-2">
                        One of the following details are missing from the order:
                      </p>
                      <ul className="mt-2">
                        <li>
                          1. Shipping or Billing address contains incorrect or
                          missing data.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Checkout;
