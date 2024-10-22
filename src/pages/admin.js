"use client";

import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  GlobeAltIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import AdminOrders from "./admin-orders";
import AdminUsers from "./admin-user";
import AdminProducts from "./admin-products";
import AdminProduct from "./admin-product";
import AdminProductNew from "./admin-product-new";
import AdminOrder from "./admin-order";
import AdminWebPages from "./admin-webPages";
import AdminWebPage from "./admin-webPage";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigation, setNavigation] = useState([
    {
      name: "Users",
      href: "/admin/users",
      icon: UsersIcon,
      current:
        window.location.pathname.indexOf("/admin/users") >= 0 ? true : false,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: DocumentDuplicateIcon,
      current:
        window.location.pathname.indexOf("/admin/order") >= 0 ? true : false,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: FolderIcon,
      current:
        window.location.pathname.indexOf("/admin/products") >= 0 ? true : false,
    },
    {
      name: "Web Pages",
      href: "/admin/webPages/HomePage",
      icon: GlobeAltIcon,
      current:
        window.location.pathname.indexOf("/admin/webPages") >= 0 ? true : false,
    },
  ]);

  return (
    <>
      <div className="mt-2 flex">
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=themeColor&shade=600"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-50 text-themeColor-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-themeColor-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current
                                    ? "text-themeColor-600"
                                    : "text-gray-400 group-hover:text-themeColor-600",
                                  "h-6 w-6 shrink-0"
                                )}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:inset-y-0 lg:flex lg:w-72 lg:flex-col h-[80vh] border-t">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-t border-gray-200 bg-white px-6 pb-4">
            <nav className="flex flex-1 flex-col mt-4">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item, index) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 text-themeColor-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-themeColor-600",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item.current
                                ? "text-themeColor-600"
                                : "text-gray-400 group-hover:text-themeColor-600",
                              "h-6 w-6 shrink-0"
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="w-full border-t">
          <main className="py-10 border-t h-[80vh] overflow-auto">
            <Routes>
              <Route path="orders" element={<AdminOrders />} />
              <Route path="order/:orderNumber" element={<AdminOrder />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/:productId" element={<AdminProduct />} />
              <Route path="products/new" element={<AdminProductNew />} />
              <Route path="webPages" element={<AdminWebPages />} />
              <Route path="webPages/:webpage" element={<AdminWebPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default Admin;
