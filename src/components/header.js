"use client";
import React, { Fragment, useState, useEffect } from "react";
import Profile from "../components/profile";
import axios from "axios";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { PhoneIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import {
  Bars3Icon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { ToastContainer, toast } from "react-toastify";

const currencies = ["CAD"];

const equipment = [
  {
    name: "DTF Printers & Dryers",
    description: "DTF Printers & Dryers",
    href: "/products",
    icon: ChartPieIcon,
  },
  {
    name: "UV Printers",
    description: "UV Printers",
    href: "/products",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Embroidery Machines",
    description: "Embroidery Machines",
    href: "/products",
    icon: ArrowPathIcon,
  },
  {
    name: "Heat Presses",
    description: "Heat Presses",
    href: "/products",
    icon: FingerPrintIcon,
  },
];
const supplies = [
  {
    name: "DTF",
    description: "Direct Heat Transfer",
    href: "/products",
    icon: ChartPieIcon,
  },
  {
    name: "UV DTF",
    description: "Ultra-Violetr Direct Heat Transfer",
    href: "/products",
    icon: SquaresPlusIcon,
  },
  {
    name: "Embroidery",
    description: "Embroidery Supplies",
    href: "/products",
    icon: ArrowPathIcon,
  },
  {
    name: "Reflective Trims",
    description: "Reflective Trims",
    href: "/products",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Heat Presses",
    description: "Your customers’ data will be safe and secure",
    href: "/products",
    icon: PlayCircleIcon,
  },
];

function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [cartOrders, setCartOrders] = useState([]);
  const [navigation, setNavigation] = useState({
    pages: [
      { name: "About", href: "/about" },
      { name: "Service", href: "/service" },
      { name: "Contact", href: "/contact" },
    ],
  });

  useEffect(() => {
    var userData = localStorage.getItem("__EurotexUser__");
    if (userData) {
      setUserDetails(JSON.parse(userData));
    } else {
      setUserDetails({});
    }
    setIsVisible(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/eurotex/products`)
      .then((response) => {
        if (response.data.success == undefined) {
          for (var i = 0; i < response.data.categories.length; i++) {
            if (response.data.categories[i].featured.length > 4) {
              response.data.categories[i].featured.splice(4);
            }
          }
          console.log(response.data);
          setNavigation({
            ...navigation,
            categories: response.data.categories,
          });
          //Shopping Cart Data
          var userData = localStorage.getItem("__EurotexUser__");
          if (userData) {
            var userToken = JSON.parse(userData);
            axios
              .get(`${process.env.REACT_APP_BASE_URL}/eurotex/cart`, {
                headers: {
                  authorization: userToken?.authToken, // Replace with your actual token
                },
              })
              .then((response1) => {
                if (response1.data.success == undefined) {
                  setIsVisible(false);
                  setCartOrders(response1.data);
                } else {
                  setIsVisible(false);
                  localStorage.removeItem("__EurotexUser__");
                  window.location.replace("/");
                }
              })
              .catch((error) => {
                setIsVisible(false);
                localStorage.removeItem("__EurotexUser__");
                window.location.replace("/");
              });
          } else {
            setIsVisible(false);
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
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
        <Profile
          showModal={showModal}
          closeModal={closeModal}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
        />

        <header className="fixed w-full bg-gray-0 z-10">
          <nav aria-label="Top">
            {/* Top navigation */}
            <div className="bg-[#E00011]">
              <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Currency selector */}
                <form>
                  <div>
                    <label htmlFor="desktop-currency" className="sr-only">
                      Currency
                    </label>
                    <div className="group relative -ml-2 rounded-md border-transparent bg-gray-900 focus-within:ring-2 focus-within:ring-white">
                      <select
                        id="desktop-currency"
                        name="currency"
                        className="flex items-center rounded-md border-transparent bg-gray-0 bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-black focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-900"
                      >
                        {currencies?.map((currency) => (
                          <option key={currency}>{currency}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </form>

                <div className="flex items-center space-x-6">
                  {userDetails?.authToken && userDetails?.role === "Admin" && (
                    <>
                      <a
                        href="/orders"
                        className="text-sm font-medium text-white hover:text-gray-100 cursor-pointer"
                      >
                        Orders
                      </a>
                      <a
                        className="text-sm font-medium text-white hover:text-gray-100 cursor-pointer"
                        onClick={openModal}
                      >
                        Profile
                      </a>
                      <a
                        href="/admin/users"
                        className="text-sm font-medium text-white hover:text-gray-100 cursor-pointer"
                      >
                        Admin
                      </a>
                    </>
                  )}
                  {userDetails?.authToken && userDetails?.role !== "Admin" && (
                    <>
                      <a
                        className="text-sm font-medium text-white hover:text-gray-100 cursor-pointer"
                        onClick={openModal}
                      >
                        Profile
                      </a>
                      <a
                        href="/orders"
                        className="text-sm font-medium text-white hover:text-gray-100 cursor-pointer"
                      >
                        Orders
                      </a>
                    </>
                  )}
                  {!userDetails?.authToken && (
                    <>
                      <a
                        href="/signin"
                        className="text-sm font-medium text-white hover:text-gray-100"
                      >
                        Sign in
                      </a>
                      <a
                        href="/signup"
                        className="text-sm font-medium text-white hover:text-gray-100"
                      >
                        Create an account
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary navigation */}
            <div className="bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200">
                  <div className="flex h-16 items-center justify-between">
                    {/* Logo (lg+) */}
                    <div className="hidden lg:flex lg:flex-1 lg:items-center">
                      <a href="/">
                        <img
                          alt="Eurotex Inc."
                          src="https://images.shirtly.com/image/upload/v1727709000/Eurotex/Logos/EUROTEX_2024_LOGO_ENG_BLUE_hpr7gz.png"
                          className="w-1/2"
                        />
                      </a>
                    </div>

                    <div className="flex lg:hidden">
                      <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                      >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>

                    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                      <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                          Supplies
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="h-5 w-5 flex-none text-gray-400"
                          />
                        </PopoverButton>

                        <PopoverPanel
                          transition
                          className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="p-4">
                            {supplies.map((item) => (
                              <div
                                key={item.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                              >
                                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                  <item.icon
                                    aria-hidden="true"
                                    className="h-6 w-6 text-gray-600 group-hover:text-themeColor-600"
                                  />
                                </div>
                                <div className="flex-auto">
                                  <a
                                    href={item.href}
                                    className="block font-semibold text-gray-900"
                                  >
                                    {item.name}
                                    <span className="absolute inset-0" />
                                  </a>
                                  <p className="mt-1 text-gray-600">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </PopoverPanel>
                      </Popover>
                      <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                          Equipment
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="h-5 w-5 flex-none text-gray-400"
                          />
                        </PopoverButton>

                        <PopoverPanel
                          transition
                          className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="p-4">
                            {equipment.map((item) => (
                              <div
                                key={item.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                              >
                                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                  <item.icon
                                    aria-hidden="true"
                                    className="h-6 w-6 text-gray-600 group-hover:text-themeColor-600"
                                  />
                                </div>
                                <div className="flex-auto">
                                  <a
                                    href={item.href}
                                    className="block font-semibold text-gray-900"
                                  >
                                    {item.name}
                                    <span className="absolute inset-0" />
                                  </a>
                                  <p className="mt-1 text-gray-600">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </PopoverPanel>
                      </Popover>

                      <a
                        href="/about"
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        About
                      </a>
                      <a
                        href="/service"
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Service
                      </a>
                      <a
                        href="/contact"
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Contact
                      </a>
                    </PopoverGroup>

                    <a href="/" className="lg:hidden text-center">
                      <img
                        alt=""
                        src="https://images.shirtly.com/image/upload/v1727709000/Eurotex/Logos/EUROTEX_2024_LOGO_ENG_BLUE_hpr7gz.png"
                        className="w-1/2 mx-auto"
                      />
                    </a>

                    <div className="flex flex-1 items-center justify-end">
                      <div className="flex items-center lg:ml-8">
                        <div className="ml-4 flow-root lg:ml-8">
                          <a
                            href="/cart"
                            className="group -m-2 flex items-center p-2"
                          >
                            <ShoppingBagIcon
                              aria-hidden="true"
                              className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                              {cartOrders?.length}
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          {/* Mobile menu */}
          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-10" />
            <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt="Eurotex North America Inc."
                    src="https://images.shirtly.com/image/upload/v1727709000/Eurotex/Logos/EUROTEX_2024_LOGO_ENG_BLUE_hpr7gz.png"
                    className="h-8 w-auto"
                  />
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <Disclosure as="div" className="-mx-3">
                      <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Equipment
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="mt-2 space-y-2">
                        {[...equipment].map((item) => (
                          <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </DisclosureButton>
                        ))}
                      </DisclosurePanel>
                    </Disclosure>
                    <a
                      href="/about"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      About
                    </a>
                    <a
                      href="/service"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Service
                    </a>
                    <a
                      href="/contact"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Contact
                    </a>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </header>
      </div>
    </>
  );
}

export default Header;
