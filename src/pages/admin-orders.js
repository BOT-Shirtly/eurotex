import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Loading from "../components/loading";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function AdminOrders() {
  const [plans, setPlans] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    var userData = localStorage.getItem("__KingJetUser__");
    if (userData) {
      setIsVisible(true);
      var userToken = JSON.parse(userData);
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/kingjetprinters/admin/orders`, {
          headers: {
            authorization: userToken?.authToken,
          },
        })
        .then((response) => {
          if (response.data.success == undefined) {
            setIsVisible(false);
            setPlans(response.data);
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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Orders
            </h1>
            <p className="mt-2 text-sm text-gray-700">Customers Orders</p>
          </div>
        </div>
        <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Order Number
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Ordered Items
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Amount Paid
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Receipt
                </th>
                <th
                  scope="col"
                  className="pl-3 pr-4 py-3.5 text-right text-sm font-semibold text-gray-900"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.length > 0
                ? plans?.map((plan, planIdx) => (
                    <tr key={plan.orderNumber}>
                      <td
                        className={classNames(
                          planIdx === 0 ? "border-b" : "border-t border-b",
                          "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                        )}
                      >
                        <div className="font-medium text-gray-900">
                          KJP{plan?.orderNumber}
                        </div>
                      </td>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-gray-200",
                          "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                        )}
                      >
                        {moment.unix(plan?.createdAt).format("MMM Do, YYYY")}
                      </td>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-gray-200",
                          "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                        )}
                      >
                        {plan?.status === "PROCESSING" ? (
                          <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                            {plan?.status}
                          </span>
                        ) : plan?.status === "PACKED" ? (
                          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                            {plan?.status}
                          </span>
                        ) : plan?.status === "SHIPPED" ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {plan?.status}
                          </span>
                        ) : plan?.status === "CANCELLED" ? (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                            {plan?.status}
                          </span>
                        ) : null}
                      </td>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-gray-200",
                          "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                        )}
                      >
                        {plan?.orderedItems?.length}&nbsp;Item(s)&nbsp;ordered
                      </td>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-gray-200",
                          "px-3 py-3.5 text-sm text-gray-500"
                        )}
                      >
                        ${plan?.paymentDetails?.orderTotal}
                      </td>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-gray-200",
                          "px-3 py-3.5 text-sm text-gray-500"
                        )}
                      >
                        <button
                          onClick={() => {
                            getCustomerReceiptUrl(plan?.paymentIntent?.id);
                          }}
                          type="button"
                          className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        >
                          Receipt
                        </button>
                      </td>
                      <td
                        className={classNames(
                          planIdx === 0 ? "" : "border-t border-transparent",
                          "relative pl-3 pr-4 py-3.5 text-right text-sm font-medium sm:pr-4"
                        )}
                      >
                        <a
                          href={`order/${plan?.orderNumber}`}
                          type="button"
                          className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        >
                          View
                        </a>
                        {planIdx !== 0 ? (
                          <div className="absolute -top-px left-0 right-6 h-px bg-gray-200" />
                        ) : null}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminOrders;
