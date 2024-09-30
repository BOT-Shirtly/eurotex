"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/react/20/solid";
import Loading from "../components/loading";
import { ToastContainer, toast } from "react-toastify";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

const policies = [
  {
    name: "Free returns",
    imageUrl:
      "https://tailwindui.com/img/ecommerce/icons/icon-returns-light.svg",
    description:
      "Not what you expected? Place it back in the parcel and attach the pre-paid postage stamp.",
  },
  {
    name: "Same day delivery",
    imageUrl:
      "https://tailwindui.com/img/ecommerce/icons/icon-calendar-light.svg",
    description:
      "We offer a delivery service that has never been done before. Checkout today and receive your products within hours.",
  },
  {
    name: "All year discount",
    imageUrl:
      "https://tailwindui.com/img/ecommerce/icons/icon-gift-card-light.svg",
    description:
      'Looking for a deal? You can use the code "ALLYEAR" at checkout and get money off all year round.',
  },
  {
    name: "For the planet",
    imageUrl:
      "https://tailwindui.com/img/ecommerce/icons/icon-planet-light.svg",
    description:
      "We’ve pledged 1% of sales to the preservation and restoration of the natural environment.",
  },
];

function Cart() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0.0);
  const [taxEstimate, setTaxEstimate] = useState(0.0);
  const [orderTotal, setOrderTotal] = useState(0.0);

  useEffect(() => {
    var userData = localStorage.getItem("__KingJetUser__");
    if (userData) {
      setIsVisible(true);
      var userToken = JSON.parse(userData);
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/kingjetprinters/cart`, {
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
            setTaxEstimate(Number((Number(subTotal1) * 13) / 100).toFixed(2));
            setOrderTotal(
              Number(
                subTotal1 + Number((Number(subTotal1) * 13) / 100)
              ).toFixed(2)
            );
          } else {
            setIsVisible(false);
            localStorage.removeItem("__KingJetUser__");
            window.location.replace("/");
          }
        })
        .catch((error) => {
          setIsVisible(false);
          localStorage.removeItem("__KingJetUser__");
          window.location.replace("/");
        });
    }
  }, []);

  const handleInputChange = (product, categoryIndex, e) => {
    if (Number(e.target.value) >= 0) {
      const updatedVariants = products.map((variant, index) => {
        if (index === categoryIndex) {
          variant.orderedCombination.qty = Number(e.target.value);
          return {
            ...variant,
            orderedCombination: variant.orderedCombination,
          };
        }
        return variant;
      });
      setProducts(updatedVariants);
      const subTotal1 = products.reduce((total, item) => {
        return (
          total +
          Number(item?.orderedCombination?.price) *
            Number(item?.orderedCombination?.qty)
        );
      }, 0);
      setSubTotal(Number(subTotal1).toFixed(2));

      setTaxEstimate(Number((subTotal1 * 13) / 100).toFixed(2));

      setOrderTotal(
        Number(subTotal1 + Number((subTotal1 * 13) / 100)).toFixed(2)
      );

      setIsVisible(true);
      delete product._id;
      const userData = JSON.parse(localStorage.getItem("__KingJetUser__"));
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/kingjetprinters/cart`,
          product,
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
            localStorage.removeItem("__KingJetUser__");
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
          localStorage.removeItem("__KingJetUser__");
          window.location.replace("/");
        });
    }
  };

  const deleteCartItem = (product) => {
    setIsVisible(true);
    const userData = JSON.parse(localStorage.getItem("__KingJetUser__"));
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/kingjetprinters/cart?combination=${product?.orderedCombination?.name}`,
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
          localStorage.removeItem("__KingJetUser__");
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
        localStorage.removeItem("__KingJetUser__");
        window.location.replace("/");
      });
  };

  return (
    <>
      {isVisible && <Loading />}
      <div className="bg-white">
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
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>

          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-t border-gray-200"
              >
                {products.length > 0 ? (
                  products?.map((product, index) => (
                    <li key={product?.prodId} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <img
                          alt={product?.imageAlt}
                          src={product?.imageSrc}
                          className="h-24 w-24 rounded-md object-contain object-center sm:h-48 sm:w-48"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <a
                                  href={product?.href}
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {product?.name}
                                </a>
                              </h3>
                            </div>
                            <div className="mt-1 flex text-sm">
                              <p className="text-gray-500">
                                {product?.orderedCombination?.name}
                              </p>
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {isNaN(product?.orderedCombination?.price)
                                ? product?.orderedCombination?.price
                                : `$${product?.orderedCombination?.price}`}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Qunatity
                            </label>
                            <div className="mt-2">
                              <input
                                id="qty"
                                name="qty"
                                type="number"
                                value={product?.orderedCombination?.qty}
                                onChange={(event) =>
                                  handleInputChange(product, index, event)
                                }
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                              />
                            </div>

                            <div className="absolute right-0 top-0">
                              <button
                                type="button"
                                onClick={() => {
                                  deleteCartItem(product);
                                }}
                                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                              >
                                <XMarkIconMini
                                  aria-hidden="true"
                                  className="h-5 w-5"
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                          <CheckIcon
                            aria-hidden="true"
                            className="h-5 w-5 flex-shrink-0 text-green-500"
                          />
                          In stock
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <a
                    href="/products"
                    type="button"
                    className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-themeColor-500 focus:ring-offset-2"
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
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order summary
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${subTotal}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex text-sm text-gray-600">
                    <span>Tax estimate (13%)</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${taxEstimate}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Order total
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    ${orderTotal}
                  </dd>
                </div>
              </dl>
              {products.length > 0 && orderTotal > 0 ? (
                <div className="mt-6">
                  <a
                    href="/checkout"
                    type="submit"
                    className="w-full block text-center rounded-md border border-transparent bg-themeColor-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-themeColor-700 focus:outline-none focus:ring-2 focus:ring-themeColor-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Checkout
                  </a>
                </div>
              ) : null}

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
                      Shipping Price
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Shipping price will be calculated on the checkout
                        screen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </form>
        </main>
        {/* Policy grid */}
        <section
          aria-labelledby="policies-heading"
          className="border-t border-gray-200 bg-gray-50"
        >
          <h2 id="policies-heading" className="sr-only">
            Our policies
          </h2>

          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
              {policies.map((policy) => (
                <div
                  key={policy.name}
                  className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                >
                  <div className="md:flex-shrink-0">
                    <div className="flow-root">
                      <img
                        alt=""
                        src={policy.imageUrl}
                        className="-my-1 mx-auto h-24 w-auto"
                      />
                    </div>
                  </div>
                  <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                    <h3 className="text-base font-medium text-gray-900">
                      {policy.name}
                    </h3>
                    <p className="mt-3 text-sm text-gray-500">
                      {policy.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Cart;
