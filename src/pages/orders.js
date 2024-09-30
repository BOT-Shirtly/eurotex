"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Loading from "../components/loading";

function Orders() {
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    var userData = localStorage.getItem("__KingJetUser__");
    if (userData) {
      setIsVisible(true);
      var userToken = JSON.parse(userData);
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/kingjetprinters/orders`, {
          headers: {
            authorization: userToken?.authToken,
          },
        })
        .then((response) => {
          if (response.data.success == undefined) {
            setIsVisible(false);
            setOrders(response.data);
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
    } else {
      localStorage.removeItem("__KingJetUser__");
      window.location.replace("/");
    }
  }, []);

  async function getCustomerReceiptUrl(paymentIntentId) {
    var userData = localStorage.getItem("__KingJetUser__");
    if (userData) {
      setIsVisible(true);
      var userToken = JSON.parse(userData);
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/kingjetprinters/getReceiptUrl?paymentIntentId=${paymentIntentId}`,
          {
            headers: {
              authorization: userToken?.authToken,
            },
          }
        )
        .then((response) => {
          if (response.data.success == undefined) {
            setIsVisible(false);
            window.open(response?.data?.receiptUrl, "_blank");
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
    } else {
      localStorage.removeItem("__KingJetUser__");
      window.location.replace("/");
    }
  }

  return (
    <>
      {isVisible && <Loading />}
      <div className="bg-white">
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Order history
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Check the status of recent orders, manage returns, and download
              invoices.
            </p>
          </div>

          <section aria-labelledby="recent-heading" className="mt-16">
            <h2 id="recent-heading" className="sr-only">
              Recent orders
            </h2>

            <div className="space-y-20">
              {orders.length > 0 ? (
                orders?.map((order, index) => (
                  <div key={index}>
                    <h3 className="sr-only">
                      Order placed on{" "}
                      <time dateTime={order?.createdAt}>
                        {order?.createdAt}
                      </time>
                    </h3>

                    <div className="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                      <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                        <div className="flex justify-between sm:block">
                          <dt className="font-medium text-gray-900">
                            Date placed
                          </dt>
                          <dd className="sm:mt-1">
                            <time dateTime={order?.createdAt}>
                              {moment
                                .unix(order?.createdAt)
                                .format("MMM Do, YYYY")}
                            </time>
                          </dd>
                        </div>
                        <div className="flex justify-between pt-6 sm:block sm:pt-0">
                          <dt className="font-medium text-gray-900">
                            Order number
                          </dt>
                          <dd className="sm:mt-1">KJP{order?.orderNumber}</dd>
                        </div>
                        <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                          <dt>Total amount</dt>
                          <dd className="sm:mt-1">
                            ${order?.paymentDetails?.orderTotal}
                          </dd>
                        </div>
                      </dl>
                      <button
                        onClick={() => {
                          getCustomerReceiptUrl(order?.paymentIntent?.id);
                        }}
                        className="mt-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-themeColor-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                      >
                        View Receipt
                        <span className="sr-only">
                          for order {order?.orderNumber}
                        </span>
                      </button>
                    </div>

                    <table className="mt-4 w-full text-gray-500 sm:mt-6">
                      <caption className="sr-only">Products</caption>
                      <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                        <tr>
                          <th
                            scope="col"
                            className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                          >
                            Qty
                          </th>
                          <th
                            scope="col"
                            className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="hidden py-3 pr-8 font-normal sm:table-cell"
                          >
                            Status
                          </th>
                          {order?.status === "SHIPPED" ? (
                            <th
                              scope="col"
                              className="hidden py-3 pr-8 font-normal sm:table-cell"
                            >
                              Tracking
                            </th>
                          ) : null}

                          <th
                            scope="col"
                            className="w-0 py-3 text-right font-normal"
                          >
                            Info
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                        {order?.orderedItems?.map((product) => (
                          <tr key={product.id}>
                            <td className="py-6 pr-8">
                              <div className="flex items-center">
                                <img
                                  alt={product.imageAlt}
                                  src={product.imageSrc}
                                  className="mr-6 h-16 w-16 rounded object-contain object-center"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {product.name}
                                    <p className="text-gray-500">
                                      {product?.orderedCombination?.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="hidden py-6 pr-8 sm:table-cell">
                              {product.orderedCombination.qty}
                            </td>
                            <td className="hidden py-6 pr-8 sm:table-cell">
                              ${product.price}
                            </td>
                            <td className="whitespace-nowrap pr-8 py-6 text-sm text-gray-500">
                              {order?.status === "PROCESSING" ? (
                                <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                                  {order?.status}
                                </span>
                              ) : order?.status === "PACKED" ? (
                                <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                                  {order?.status}
                                </span>
                              ) : order?.status === "SHIPPED" ? (
                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                  {order?.status}
                                </span>
                              ) : order?.status === "CANCELLED" ? (
                                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                  {order?.status}
                                </span>
                              ) : null}
                            </td>
                            {order?.status === "SHIPPED" ? (
                              <td className="hidden py-6 pr-8 sm:table-cell">
                                {order?.tracking}
                              </td>
                            ) : null}

                            <td className="whitespace-nowrap py-6 text-right font-medium">
                              <a
                                href={product.href}
                                className="text-themeColor-600"
                              >
                                View
                                <span className="hidden lg:inline">
                                  {" "}
                                  Product
                                </span>
                                <span className="sr-only">
                                  , {product.name}
                                </span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                    No Orders Placed Yet!!
                  </span>
                </a>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Orders;
