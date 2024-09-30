"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import Loading from "../components/loading";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/20/solid";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const activity = [
  {
    id: 1,
    type: "created",
    person: { name: "Chelsea Hagon" },
    date: "7d ago",
    dateTime: "2023-01-23T10:32",
  },
  {
    id: 2,
    type: "edited",
    person: { name: "Chelsea Hagon" },
    date: "6d ago",
    dateTime: "2023-01-23T11:03",
  },
  {
    id: 3,
    type: "sent",
    person: { name: "Chelsea Hagon" },
    date: "6d ago",
    dateTime: "2023-01-23T11:24",
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56",
  },
  {
    id: 5,
    type: "viewed",
    person: { name: "Alex Curren" },
    date: "2d ago",
    dateTime: "2023-01-24T09:12",
  },
  {
    id: 6,
    type: "paid",
    person: { name: "Alex Curren" },
    date: "1d ago",
    dateTime: "2023-01-24T09:20",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function AdminOrder() {
  const [isVisible, setIsVisible] = useState(false);
  const { orderNumber } = useParams();
  const [invoice, setInvoice] = useState({});
  const [activity, setActivity] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [comment, setComment] = useState("");
  useEffect(() => {
    var userData = localStorage.getItem("__KingJetUser__");
    if (userData) {
      setIsVisible(true);
      var userToken = JSON.parse(userData);
      setUserDetails(userToken);
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}/kingjetprinters/admin/order?orderNumber=${orderNumber}`,
          {
            headers: {
              authorization: userToken?.authToken,
            },
          }
        )
        .then((response) => {
          if (response.data.success == undefined) {
            setIsVisible(false);
            setInvoice(response.data[0]);
            setActivity(response.data[0].activity);
            setOrderStatus(response.data[0].status);
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
  useEffect(() => {
    if (orderStatus != "SHIPPED") {
      setTracking("");
    }
  }, [orderStatus]);

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

  const updateOrder = () => {
    setIsVisible(true);
    const userData = JSON.parse(localStorage.getItem("__KingJetUser__"));
    var updateData = {
      orderNumber: Number(orderNumber),
      status: orderStatus,
      tracking,
      activity: [
        ...activity,
        {
          type:
            orderStatus == "CANCELLED"
              ? "cancelled"
              : orderStatus == "SHIPPED"
              ? "shipped"
              : "updated",
          person: { name: userData?.name },
          dateTime: moment().unix(),
        },
      ],
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/kingjetprinters/admin/order`,
        updateData,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Order Updated.", {
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
          setActivity([
            ...activity,
            {
              type:
                orderStatus == "CANCELLED"
                  ? "cancelled"
                  : orderStatus == "SHIPPED"
                  ? "shipped"
                  : "updated",
              person: { name: userData?.name },
              dateTime: moment().unix(),
            },
          ]);
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
  };
  const addComment = () => {
    setIsVisible(true);
    const userData = JSON.parse(localStorage.getItem("__KingJetUser__"));
    var updateData = {
      orderNumber: Number(orderNumber),
      activity: [
        ...activity,
        {
          type: "commented",
          person: {
            name: userData?.name,
            imageUrl:
              "https://api.dicebear.com/9.x/initials/svg?seed=" +
              userDetails?.name +
              "&radius=10",
          },
          comment,
          dateTime: moment().unix(),
        },
      ],
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/kingjetprinters/admin/order`,
        updateData,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Order Updated.", {
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
          setComment("");
          setActivity([
            ...activity,
            {
              type: "commented",
              person: {
                name: userData?.name,
                imageUrl:
                  "https://api.dicebear.com/9.x/initials/svg?seed=" +
                  userDetails?.name +
                  "&radius=10",
              },
              comment,
              dateTime: moment().unix(),
            },
          ]);
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
  };

  const generatePDF = () => {
    setIsVisible(true);
    const userData = JSON.parse(localStorage.getItem("__KingJetUser__"));
    var updateData = {
      orderNumber: Number(orderNumber),
      status: orderStatus,
      tracking,
      activity: [
        ...activity,
        {
          type: "work order created for",
          person: { name: userData?.name },
          dateTime: moment().unix(),
        },
      ],
    };
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/kingjetprinters/admin/order`,
        updateData,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Order Updated.", {
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
          setActivity([
            ...activity,
            {
              type: "work order created for",
              person: { name: userData?.name },
              dateTime: moment().unix(),
            },
          ]);

          // Generate PDF
          const doc = new jsPDF();
          const order = invoice;
          const { orderedItems, billingAddress, shippingAddress } = order;
          const logo =
            "https://images.shirtly.com/image/upload/v1723469527/KingJetPrinters/Logos/KingJetCanada_xlch7q.png";
          var outerOrderedItems = [];
          for (var i = 0; i < orderedItems.length; i++) {
            var orderedItemsBody = [];
            orderedItemsBody.push(orderedItems[i]?.name);
            orderedItemsBody.push(orderedItems[i]?.orderedCombination?.name);
            orderedItemsBody.push(orderedItems[i]?.orderedCombination?.qty);
            outerOrderedItems.push(orderedItemsBody);
          }
          // Fetch the image and add it to the PDF
          const img = new Image();
          img.src = logo;
          img.crossOrigin = "Anonymous";
          img.onload = function () {
            doc.addImage(img, "PNG", 13, 10, 30, 12); // Adjust the width and height as needed

            // Add some text
            doc.setFontSize(12);
            doc.text(`Order Details #KJP${orderNumber}`, 14, 30);

            // Add some text
            doc.setFontSize(10);
            doc.text(
              `Order Date: ${moment
                .unix(invoice?.paymentIntent?.created)
                .format("MMM Do, YYYY")}`,
              14,
              36
            );

            doc.autoTable({
              head: [["From", "Bill To", "Ship To"]],
              body: [
                [
                  "KingJetPrinters Canada, Inc\n122 Middleton Street\nBrantford, ON N3S7V7\nCanada",
                  `${billingAddress.name}\n${billingAddress.address}\n${
                    billingAddress.city
                  }, ${billingAddress.state} ${billingAddress.postal}\n${
                    billingAddress.country === "CA" ? "Canada" : "US"
                  }`,
                  `${shippingAddress.name}\n${shippingAddress.address}\n${
                    shippingAddress.city
                  }, ${shippingAddress.state} ${shippingAddress.postal}\n${
                    shippingAddress.country === "CA" ? "Canada" : "US"
                  }`,
                ],
              ],
              theme: "grid",
              styles: {
                fontSize: 10,
                textColor: [0, 0, 0], // Black text
                fillColor: [255, 255, 255], // White background for cells
                lineColor: [0, 0, 0], // Black borders
              },
              headStyles: {
                fillColor: [0, 0, 0], // Black background for header
                textColor: [255, 255, 255], // White text for header
              },
              alternateRowStyles: {
                fillColor: [255, 255, 255], // White background for alternate rows
              },
              margin: { top: 42 },
            });

            doc.autoTable({
              head: [["Items", "Variant", "Qty"]],
              body: outerOrderedItems,
              theme: "grid",
              styles: {
                fontSize: 10,
                textColor: [0, 0, 0], // Black text
                fillColor: [255, 255, 255], // White background for cells
                lineColor: [0, 0, 0], // Black borders
              },
              headStyles: {
                fillColor: [0, 0, 0], // Black background for header
                textColor: [255, 255, 255], // White text for header
              },
              alternateRowStyles: {
                fillColor: [255, 255, 255], // White background for alternate rows
              },
            });
            // Calculate Y-position for bottom text
            const pageHeight = doc.internal.pageSize.getHeight();
            const bottomMargin = 10; // Set bottom margin (distance from bottom of page)
            const bottomTextY = pageHeight - bottomMargin;

            // Add text at the bottom
            doc.setFontSize(12);
            doc.text("Thank you for your purchase!", 14, bottomTextY);

            doc.save(`WorkOrder-KJP${orderNumber}.pdf`);
          };
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
  };

  return (
    <>
      {isVisible && <Loading />}
      <main>
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
        <header className="relative isolate">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
              <div
                style={{
                  clipPath:
                    "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)",
                }}
                className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
              <div className="flex items-center gap-x-6">
                <img
                  alt=""
                  src={
                    "https://api.dicebear.com/9.x/initials/svg?seed=King Jet Printers&radius=10"
                  }
                  className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10"
                />
                <h1>
                  <div className="text-sm leading-6 text-gray-500">
                    Order&nbsp;
                    <span className="text-gray-700">#KJP{orderNumber}</span>
                  </div>
                  <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                    KingJetPrinters Canada, Inc
                  </div>
                </h1>
              </div>
              <div className="flex items-center gap-x-4 sm:gap-x-6">
                <button
                  onClick={() => {
                    const currentUrl = window.location.href;
                    navigator.clipboard
                      .writeText(currentUrl)
                      .then(() => {
                        toast.success("URL copied.", {
                          position: "bottom-center",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                        });
                      })
                      .catch((err) => {
                        console.error("Failed to copy: ", err);
                      });
                  }}
                  type="button"
                  className="hidden text-sm font-semibold leading-6 text-gray-900 sm:block"
                >
                  Copy URL
                </button>

                <button
                  type="button"
                  onClick={generatePDF}
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-themeColor-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                >
                  <ClipboardDocumentIcon
                    aria-hidden="true"
                    className="-ml-0.5 h-5 w-5"
                  />
                  Work Order
                </button>

                <Menu as="div" className="relative sm:hidden">
                  <MenuButton className="-m-3 block p-3">
                    <span className="sr-only">More</span>
                    <EllipsisVerticalIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-500"
                    />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <button
                        type="button"
                        className="block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                      >
                        Copy URL
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Invoice summary */}
            <div className="lg:col-start-3 lg:row-end-1">
              <h2 className="sr-only">Summary</h2>
              <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
                <dl className="flex flex-wrap">
                  <div className="flex-auto pl-6 pt-6">
                    <dt className="text-sm font-semibold leading-6 text-gray-900">
                      Amount
                    </dt>
                    <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
                      $
                      {(Number(invoice?.paymentIntent?.amount) / 100).toFixed(
                        2
                      )}
                    </dd>
                  </div>
                  <div className="flex-none self-end px-6 pt-4">
                    <dt className="sr-only">Status</dt>
                    <dd className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20">
                      Paid
                    </dd>
                  </div>
                  <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                    <dt className="flex-none">
                      <span className="sr-only">Client</span>
                      <UserCircleIcon
                        aria-hidden="true"
                        className="h-6 w-5 text-gray-400"
                      />
                    </dt>
                    <dd className="text-sm font-medium leading-6 text-gray-900">
                      {invoice?.paymentIntent?.metadata?.customer_name}
                    </dd>
                  </div>
                  <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                      <CalendarDaysIcon
                        aria-hidden="true"
                        className="h-6 w-5 text-gray-400"
                      />
                    </dt>
                    <dd className="text-sm leading-6 text-gray-500">
                      <time dateTime="2023-01-31">
                        {moment
                          .unix(invoice?.paymentIntent?.created)
                          .format("MMM Do, YYYY")}
                      </time>
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
                  <button
                    onClick={() => {
                      getCustomerReceiptUrl(invoice?.paymentIntent?.id);
                    }}
                    href="#"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Download receipt <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Invoice */}
            <div className="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
              <h2 className="text-base font-semibold leading-6 text-gray-900">
                Order Details&nbsp;#KJP{orderNumber}
              </h2>
              <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                <div className="sm:pr-4">
                  <dt className="inline text-gray-500">Issued on:</dt>{" "}
                  <dd className="inline text-gray-700">
                    <time>
                      {moment.unix(invoice?.createdAt).format("MMM Do, YYYY")}
                    </time>
                  </dd>
                </div>
                <div className="mt-2 sm:mt-0 sm:pl-4">
                  <dt className="inline text-gray-500">Last Update:</dt>{" "}
                  <dd className="inline text-gray-700">
                    {invoice?.lastUpdate ? (
                      <time>
                        {moment
                          .unix(invoice?.lastUpdate)
                          .format("MMM Do, YYYY")}
                      </time>
                    ) : (
                      <time>NA</time>
                    )}
                  </dd>
                </div>
              </dl>
              <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-3">
                <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                  <dt className="font-semibold text-gray-900">From</dt>
                  <dd className="mt-2 text-gray-500">
                    <span className="font-medium text-gray-900">
                      KingJetPrinters Canada, Inc
                    </span>
                    <br />
                    122 Middleton Street
                    <br />
                    Brantford, ON N3S7V7 CA
                  </dd>
                </div>
                <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                  <dt className="font-semibold text-gray-900">Bill To</dt>
                  <dd className="mt-2 text-gray-500">
                    <span className="font-medium text-gray-900">
                      {invoice?.billingAddress?.name}
                    </span>
                    <br />
                    {invoice?.billingAddress?.address}
                    <br />
                    {invoice?.billingAddress?.city},{" "}
                    {`${invoice?.billingAddress?.state?.split("-")[0]}`}{" "}
                    {invoice?.billingAddress?.postal}{" "}
                    {invoice?.billingAddress?.country}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                  <dt className="font-semibold text-gray-900">Ship To</dt>
                  <dd className="mt-2 text-gray-500">
                    <span className="font-medium text-gray-900">
                      {invoice?.shippingAddress?.name}
                    </span>
                    <br />
                    {invoice?.shippingAddress?.address}
                    <br />
                    {invoice?.shippingAddress?.city},{" "}
                    {`${invoice?.shippingAddress?.state?.split("-")[0]}`}{" "}
                    {invoice?.shippingAddress?.postal}{" "}
                    {invoice?.shippingAddress?.country}
                  </dd>
                </div>
              </dl>
              <table className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
                <colgroup>
                  <col className="w-full" />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead className="border-b border-gray-200 text-gray-900">
                  <tr>
                    <th scope="col" className="px-0 py-3 font-semibold">
                      Items
                    </th>
                    <th
                      scope="col"
                      className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell"
                    >
                      Qty
                    </th>
                    <th
                      scope="col"
                      className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell"
                    >
                      Unit Price
                    </th>
                    <th
                      scope="col"
                      className="py-3 pl-8 pr-0 text-right font-semibold"
                    >
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice?.orderedItems?.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="max-w-0 px-0 py-5 align-top">
                        <div className="flex items-center">
                          <div className="h-11 w-11 flex-shrink-0">
                            <img
                              alt={item?.imageAlt}
                              src={`${item?.imageSrc}`}
                              className="h-11 w-11 bg-white object-contain ring-1 ring-gray-900/10"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="truncate font-medium text-gray-900">
                              {item?.name}
                            </div>
                            <div className="truncate w-64 overflow-hidden whitespace-nowrap text-gray-500">
                              {item?.orderedCombination?.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                        {item?.orderedCombination?.qty}
                      </td>
                      <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                        ${Number(item?.orderedCombination?.price).toFixed(2)}
                      </td>
                      <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">
                        $
                        {Number(
                          Number(item?.orderedCombination?.price) *
                            item?.orderedCombination?.qty
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      scope="row"
                      className="pt-4 font-normal text-gray-700 sm:hidden"
                    >
                      Weight (pounds)
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      Weight (pounds)
                    </th>
                    <td className="pb-0 pl-8 pr-0 pt-4 text-right tabular-nums text-gray-900">
                      {invoice?.paymentDetails?.totalWeight}
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-0 pb-0 pt-6 font-normal text-gray-700 sm:hidden"
                    >
                      Subtotal
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden px-0 pb-0 pt-6 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      Subtotal
                    </th>
                    <td className="pb-0 pl-8 pr-0 pt-6 text-right tabular-nums text-gray-900">
                      ${invoice?.paymentDetails?.subTotal}
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-0 pb-0 pt-6 font-normal text-gray-700 sm:hidden"
                    >
                      Shipping Cost
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden px-0 pb-0 pt-6 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      Shipping Cost
                    </th>
                    <td className="pb-0 pl-8 pr-0 pt-6 text-right tabular-nums text-gray-900">
                      ${invoice?.paymentDetails?.shippingCost}
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="pt-4 font-normal text-gray-700 sm:hidden"
                    >
                      Tax
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      Tax
                    </th>
                    <td className="pb-0 pl-8 pr-0 pt-4 text-right tabular-nums text-gray-900">
                      ${invoice?.paymentDetails?.taxEstimate}
                    </td>
                  </tr>

                  <tr>
                    <th
                      scope="row"
                      className="pt-4 font-semibold text-gray-900 sm:hidden"
                    >
                      Total
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                    >
                      Total
                    </th>
                    <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                      ${invoice?.paymentDetails?.orderTotal}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="lg:col-start-3">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => {
                    setOrderStatus(e.target.value);
                  }}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                >
                  <option value="PROCESSING">In-processing</option>
                  <option value="PACKED">Packed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="CANCELLED">Cancel</option>
                </select>
              </div>
              {orderStatus == "SHIPPED" ? (
                <div className="rounded-md mt-5 px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-themeColor-600">
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-gray-900"
                  >
                    Tracking Number
                  </label>
                  <input
                    value={tracking}
                    onChange={(e) => {
                      setTracking(e.target.value);
                    }}
                    type="text"
                    className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              ) : null}
              {orderStatus == "SHIPPED" ? (
                tracking ? (
                  <button
                    type="button"
                    onClick={updateOrder}
                    className="w-full rounded bg-red-600 px-2 py-1 text-sm mt-5 font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                  >
                    Update
                  </button>
                ) : null
              ) : (
                <button
                  type="button"
                  onClick={updateOrder}
                  className="w-full rounded bg-red-600 px-2 py-1 text-sm mt-5 font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                >
                  Update
                </button>
              )}
              {/* Activity feed */}
              <h2 className="text-sm font-semibold leading-6 text-gray-900 mt-5">
                Activity
              </h2>
              <ul role="list" className="mt-6 space-y-6">
                {activity?.map((activityItem, index) => (
                  <li key={index} className="relative flex gap-x-4">
                    <div
                      className={classNames(
                        index === activity.length - 1 ? "h-6" : "-bottom-6",
                        "absolute left-0 top-0 flex w-6 justify-center"
                      )}
                    >
                      <div className="w-px bg-gray-200" />
                    </div>
                    {activityItem?.type === "commented" ? (
                      <>
                        <img
                          alt=""
                          src={activityItem.person.imageUrl}
                          className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                        />
                        <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                          <div className="flex justify-between gap-x-4">
                            <div className="py-0.5 text-xs leading-5 text-gray-500">
                              <span className="font-medium text-gray-900">
                                {activityItem?.person?.name}
                              </span>{" "}
                              commented
                            </div>
                            <time className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                              {moment
                                .unix(activityItem?.dateTime)
                                .format("MMM DD, YYYY")}
                            </time>
                          </div>
                          <p className="text-sm leading-6 text-gray-500">
                            {activityItem?.comment}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                          {activityItem?.type === "paid" ? (
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="h-6 w-6 text-themeColor-600"
                            />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                          )}
                        </div>
                        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                          <span className="font-medium text-gray-900">
                            {activityItem?.person?.name}
                          </span>{" "}
                          {activityItem?.type} the order.
                        </p>
                        <time className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                          {moment
                            .unix(activityItem?.dateTime)
                            .format("MMM DD, YYYY")}
                        </time>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {/* New comment form */}
              <div className="mt-5 flex gap-x-3">
                <img
                  alt="Admin user image"
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${userDetails?.name}&radius=10`}
                  className="h-6 w-6 flex-none rounded-full bg-gray-50"
                />
                <div className="relative flex-auto">
                  <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-themeColor-600">
                    <label htmlFor="comment" className="sr-only">
                      Add your comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={2}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                      placeholder="Add your comment..."
                      className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      value={comment}
                    />
                  </div>
                  {comment ? (
                    <div className="absolute inset-x-0 bottom-0 flex flex-end py-2 pl-3 pr-2 justify-end">
                      <button
                        type="submit"
                        onClick={addComment}
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Comment
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminOrder;
