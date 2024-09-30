import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loading from "components/loading";
import axios from "axios";

const incentives = [
  {
    name: "Product Catalog",
    imageSrc:
      "https://tailwindui.com/img/ecommerce/icons/icon-returns-light.svg",
    description:
      "It's not actually free we just price it into the products. Someone's paying for it, and it's not us.",
    href: "https://kingjetprinter.com/wp-content/uploads/2024/06/Powderless-DTF-Printer.pdf",
  },
  {
    name: "Tech-Support",
    imageSrc:
      "https://tailwindui.com/img/ecommerce/icons/icon-delivery-light.svg",
    description:
      "If it breaks in the first 10 years we'll replace it. After that you're on your own though.",
    href: "#",
  },
  {
    name: "Printing Video",
    imageSrc: "https://tailwindui.com/img/ecommerce/icons/icon-chat-light.svg",
    description:
      "If you don't like it, trade it to one of your friends for something of theirs. Don't send it here though.",
    href: "#",
  },
];

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    country: "",
    email: "",
    message: "",
  });
  const handleChange = (e) => {
    // Update state with input changes
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const submitForm = () => {
    setIsVisible(true);
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/kingjetprinters/customerContact`,
        formData
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Request Submitted.", {
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
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          {/* <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-1">
                    <div className="overflow-hidden rounded-lg bg-gray-100 mx-auto">
                        <img
                            src="https://kingjetprinter.com/wp-content/uploads/2024/08/%E9%87%91%E6%8D%B7%E7%94%B3%E6%98%8E-1200x628-2.jpg"
                        /> 
                    </div>
                </div>
                <div className="rounded-2xl bg-gray-0 px-6 py-16 sm:p-16 mb-10">
                    <div className="mx-auto max-w-xl lg:max-w-none">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                We're Here For You...
                            </h2>
                             <p className="mt-4 text-gray-500">
                                We provide overseas technical support, on-site & online support, 1 vs 1 technical support and professional Spanish translator support. 
                            </p>
                        </div>
                        <div className="mx-auto mt-12 grid max-w-sm grid-cols-1 gap-x-8 gap-y-10 sm:max-w-none lg:grid-cols-3">
                            {incentives.map((incentive) => (
                                <div key={incentive.name} className="text-center sm:flex sm:text-left lg:block lg:text-center">
                                    <div className="sm:flex-shrink-0">
                                        <div className="flow-root">
                                            <img alt="" src={incentive.imageSrc} className="mx-auto h-25 w-25" />
                                        </div>
                                    </div>
                                    <div className="mt-3 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
                                        <h3 className="text-sm font-medium text-gray-900 mb-4">{incentive.name}</h3>
                                        <a
                                            type="button"
                                            href={incentive.href}
                                            target='_blank'
                                            className="rounded-md bg-themeColor-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                                        >
                                            Get Started
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}
          <div className="relative isolate bg-white py-16 sm:py-4">
            {/* <svg
              aria-hidden="true"
              className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            >
              <defs>
                <pattern
                  x="50%"
                  y={-64}
                  id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                  width={200}
                  height={200}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y={-64} className="overflow-visible fill-gray-50">
                <path
                  d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M299.5 800h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                width="100%"
                height="100%"
                strokeWidth={0}
              />
            </svg> */}
            <div className="mx-auto">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                Contact Us
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                Have a Question or Inquiry? We're Here to Help.
                <br />
                Provide us with your details in the form, and a KingJet Printers
                Canada representative will get back to you within 24-48 hours.
                Ready to take your business to the next level?
              </p>
              <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
                <div className="lg:flex-auto">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Name
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phone-number"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Phone number
                      </label>
                      <div className="relative mt-2.5">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <label htmlFor="country" className="sr-only">
                            Country
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm"
                          >
                            <option value={"US"}>US</option>
                            <option value={"CA"}>CA</option>
                          </select>
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400"
                          />
                        </div>
                        <input
                          type="number"
                          id="contact"
                          name="contact"
                          value={formData.contact}
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Message
                      </label>
                      <div className="mt-2.5">
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-10">
                    <button
                      onClick={submitForm}
                      className="block w-full rounded-md bg-themeColor-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Let’s talk
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    By submitting this form, I agree to the&nbsp;
                    <a
                      href="/privacy-policy"
                      className="font-semibold text-themeColor-600"
                    >
                      privacy&nbsp;policy
                    </a>
                    .
                  </p>
                </div>
                <div className="lg:mt-0 lg:w-80 lg:flex-none">
                  <img
                    alt="KingJetPrinters Canada Logo"
                    src="https://images.shirtly.com/image/upload/v1723469527/KingJetPrinters/Logos/KingJetCanada_xlch7q.png"
                    className="w-full"
                  />
                  <figure className="mt-10">
                    <blockquote className="text-lg font-semibold leading-8 text-gray-900">
                      <p className="text-md">
                        Specializing in the sale of DTF (Direct-to-Film) inks,
                        printing supplies, and equipment, we cater to both
                        businesses offering DTF printing services and
                        individuals across Canada.
                        <br></br>
                        Our commitment to excellence is reflected not only in
                        our products but also in our customer service. We
                        provide comprehensive Canadian technical support,
                        offering both on-site and online assistance, as well as
                        personalized one-on-one technical support. At KingJet
                        Printers Canada, we are more than just a supplier—we are
                        a partner dedicated to helping you grow your business.
                      </p>
                    </blockquote>
                    {/* <figcaption className="mt-10 flex gap-x-6">
                    <img
                      alt=""
                      src="https://images.shirtly.com/image/upload/c_crop,ar_1:1/v1709325209/Twiga/Meet%20the%20Team/-955947114499786203_ikihrn.jpg"
                      className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    />
                    <div>
                      <div className="text-base font-semibold text-gray-900">
                        Sasha Mitic
                      </div>
                      <div className="text-sm leading-6 text-gray-600">
                        CEO of Workcation
                      </div>
                    </div>
                  </figcaption> */}
                  </figure>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 pt-16 lg:grid-cols-3">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Canadian Locations
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Ontario Office
                </h3>
                <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                  <p>122 Middleton Street</p>
                  <p>Brantford, ON N3S7V7</p>
                </address>
              </div>
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Québec Office
                </h3>
                <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                  <p>4240 Rue Seré</p>
                  <p>Montréal QC H4T 1A6</p>
                </address>
              </div>
              {/* <div className="rounded-2xl bg-gray-50 p-10">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                New York
              </h3>
              <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                <p>886 Walter Street</p>
                <p>New York, NY 12345</p>
              </address>
            </div>
            <div className="rounded-2xl bg-gray-50 p-10">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Toronto
              </h3>
              <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                <p>7363 Cynthia Pass</p>
                <p>Toronto, ON N3Y 4H8</p>
              </address>
            </div>
            <div className="rounded-2xl bg-gray-50 p-10">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Chicago
              </h3>
              <address className="mt-3 space-y-1 text-sm not-italic leading-6 text-gray-600">
                <p>726 Mavis Island</p>
                <p>Chicago, IL 60601</p>
              </address>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
