"use client";
import React, { Fragment, useState, useEffect } from "react";
import Profile from "../components/profile";
import axios from "axios";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
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

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [cartOrders, setCartOrders] = useState([]);
  const [navigation, setNavigation] = useState({
    pages: [
      { name: "About", href: "/about" },
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
        {/* Mobile menu */}
        <Dialog
          open={open}
          onClose={setOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <div className="flex px-4 pb-2 pt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* Links */}
              <TabGroup className="mt-2">
                <div className="border-b border-gray-200">
                  <TabList className="-mb-px flex space-x-8 px-4">
                    {navigation?.categories?.map((category) => (
                      <Tab
                        key={category.name}
                        className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-[selected]:border-themeColor-600 data-[selected]:text-themeColor-600"
                      >
                        {category.name}
                      </Tab>
                    ))}
                  </TabList>
                </div>
                <TabPanels as={Fragment}>
                  {navigation?.categories?.map((category) => (
                    <TabPanel
                      key={category.name}
                      className="space-y-12 px-4 py-6"
                    >
                      <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                        {category?.featured?.map((item) => (
                          <div key={item.name} className="group relative">
                            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                              <img
                                alt={item.imageAlt}
                                src={item.imageSrc}
                                className="object-cover object-center"
                              />
                            </div>
                            <a
                              href={item.href}
                              className="mt-6 block text-sm font-medium text-gray-900"
                            >
                              <span
                                aria-hidden="true"
                                className="absolute inset-0 z-10"
                              />
                              {item.name}
                            </a>
                            <p
                              aria-hidden="true"
                              className="mt-1 text-sm text-gray-500"
                            >
                              Shop now
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabPanel>
                  ))}
                </TabPanels>
              </TabGroup>

              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                {navigation?.pages?.map((page) => (
                  <div key={page.name} className="flow-root">
                    <a
                      href={page.href}
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      {page.name}
                    </a>
                  </div>
                ))}
              </div>

              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                <div className="flow-root">
                  <a
                    href="/signup"
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    Create an account
                  </a>
                </div>
                <div className="flow-root">
                  <a
                    href="/signin"
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    Sign in
                  </a>
                </div>
              </div>

              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                {/* Currency selector */}
                <form>
                  <div className="inline-block">
                    <label htmlFor="mobile-currency" className="sr-only">
                      Currency
                    </label>
                    <div className="group relative -ml-2 rounded-md border-transparent focus-within:ring-2 focus-within:ring-white">
                      <select
                        id="mobile-currency"
                        name="currency"
                        className="flex items-center rounded-md border-transparent bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-gray-700 focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-800"
                      >
                        {currencies?.map((currency) => (
                          <option key={currency}>{currency}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

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

                    <div className="hidden h-full lg:flex z-40">
                      {/* Flyout menus */}
                      <PopoverGroup className="inset-x-0 bottom-0 px-4 z-40">
                        <div className="flex h-full justify-center space-x-8 z-40">
                          {navigation?.categories?.map((category) => (
                            <Popover key={category.name} className="flex z-40">
                              <div className="relative flex">
                                <PopoverButton className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-[open]:border-themeColor-600 data-[open]:text-themeColor-600">
                                  {category.name}
                                </PopoverButton>
                              </div>

                              <PopoverPanel
                                transition
                                className="z-50 absolute inset-x-0 top-full text-sm text-gray-500 transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                              >
                                {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                <div
                                  aria-hidden="true"
                                  className="absolute inset-0 top-1/2 bg-white shadow"
                                />

                                <div className="relative bg-white">
                                  <div className="mx-auto max-w-7xl px-8 py-5">
                                    <div className="relative mt-5">
                                      <div
                                        aria-hidden="true"
                                        className="absolute inset-0 flex items-center"
                                      >
                                        <div className="w-full border-t border-gray-300" />
                                      </div>
                                      <div className="relative flex items-center justify-between">
                                        <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
                                          {category.name}
                                        </span>
                                        <a
                                          href="/products"
                                          type="button"
                                          className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                          <span>All {category.name}...</span>
                                        </a>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-4">
                                      {category?.featured?.map((item) => (
                                        <div
                                          key={item.name}
                                          className="group relative"
                                        >
                                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-0 group-hover:opacity-75">
                                            <img
                                              alt={item.imageAlt}
                                              src={item.imageSrc}
                                              className="object-contain object-center"
                                            />
                                          </div>
                                          <a
                                            href={item.href}
                                            className="mt-4 block font-medium text-gray-900"
                                          >
                                            <span
                                              aria-hidden="true"
                                              className="absolute inset-0 z-10"
                                            />
                                            {item.name}
                                          </a>
                                          <p
                                            aria-hidden="true"
                                            className="mt-1"
                                          >
                                            Shop now
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </PopoverPanel>
                            </Popover>
                          ))}

                          {navigation?.pages?.map((page) => (
                            <a
                              key={page.name}
                              href={page.href}
                              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                            >
                              {page.name}
                            </a>
                          ))}
                        </div>
                      </PopoverGroup>
                    </div>

                    <div className="flex flex-1 items-center lg:hidden">
                      <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                      >
                        <span className="sr-only">Open menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>

                    <a href="/" className="lg:hidden text-center">
                      <img
                        alt=""
                        src="https://images.shirtly.com/image/upload/v1723469527/KingJetPrinters/Logos/KingJetCanada_xlch7q.png"
                        className="w-1/3 mx-auto"
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
        </header>
      </div>
    </>
  );
}

export default Header;
