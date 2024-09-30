"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  FunnelIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import Loading from "../components/loading";
import { ToastContainer, toast } from "react-toastify";

const filters = {
  category: [
    { value: "printers", label: "DTF Printer", checked: false },
    { value: "printers", label: "UV Printer", checked: false },
    { value: "supplies", label: "Supplies", checked: false },
  ],
  label: [
    { value: "new", label: "All New Arrivals", checked: false },
    { value: "sale", label: "Sale", checked: false },
  ],
};
const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Products() {
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [pageHeader, setPageHeader] = useState(
    filters.category.map((c) => c.label).join(" / ")
  );
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/kingjetprinters/products/all`)
      .then((response) => {
        if (response.data.success == undefined) {
          setIsVisible(false);
          setProducts(response.data);
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
        <main className="pb-24">
          <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              All Products
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
              {pageHeader}
            </p>
          </div>

          {/* Filters */}
          <Disclosure
            as="section"
            aria-labelledby="filter-heading"
            className="grid items-center border-b border-t border-gray-200"
          >
            <h2 id="filter-heading" className="sr-only">
              Filters
            </h2>
            {/* <div className="relative col-start-1 row-start-1 py-4">
              <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
                <div>
                  <DisclosureButton className="group flex items-center font-medium text-gray-700">
                    <FunnelIcon
                      aria-hidden="true"
                      className="mr-2 h-5 w-5 flex-none text-gray-400 group-hover:text-gray-500"
                    />
                    Filters
                  </DisclosureButton>
                </div>
                <div className="pl-6">
                  <button type="button" className="text-gray-500">
                    Clear all
                  </button>
                </div>
              </div>
            </div> */}
            <DisclosurePanel className="border-t border-gray-200 py-10">
              <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
                <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
                  <fieldset>
                    <legend className="block font-medium">Category</legend>
                    <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                      {filters.category.map((option, optionIdx) => (
                        <div
                          key={option.value}
                          className="flex items-center text-base sm:text-sm"
                        >
                          <input
                            defaultValue={option.value}
                            defaultChecked={option.checked}
                            id={`category-${optionIdx}`}
                            name="category[]"
                            type="checkbox"
                            className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-themeColor-600 focus:ring-themeColor-500"
                          />
                          <label
                            htmlFor={`category-${optionIdx}`}
                            className="ml-3 min-w-0 flex-1 text-gray-600"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="block font-medium">Label</legend>
                    <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                      {filters.label.map((option, optionIdx) => (
                        <div
                          key={option.value}
                          className="flex items-center text-base sm:text-sm"
                        >
                          <input
                            defaultValue={option.value}
                            defaultChecked={option.checked}
                            id={`category-${optionIdx}`}
                            name="category[]"
                            type="checkbox"
                            className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-themeColor-600 focus:ring-themeColor-500"
                          />
                          <label
                            htmlFor={`category-${optionIdx}`}
                            className="ml-3 min-w-0 flex-1 text-gray-600"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
            </DisclosurePanel>
            <div className="col-start-1 row-start-1 py-4">
              <div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
                <Menu as="div" className="relative inline-block">
                  <div className="flex">
                    <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      Sort
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <MenuItem key={option.name}>
                          <a
                            href={option.href}
                            className={classNames(
                              option.current
                                ? "font-medium text-gray-900"
                                : "text-gray-500",
                              "block px-4 py-2 text-sm data-[focus]:bg-gray-100"
                            )}
                          >
                            {option.name}
                          </a>
                        </MenuItem>
                      ))}
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </Disclosure>

          {/* Product grid */}
          <section
            aria-labelledby="products-heading"
            className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8"
          >
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
              {products?.map((product) => (
                <div
                  key={product.id}
                  className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
                >
                  <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-0 group-hover:opacity-75">
                    <img
                      alt={product.imageAlt}
                      src={product.imageSrc}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                  <div className="pb-4 pt-10 text-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-4 text-base font-medium text-gray-900">
                      {isNaN(product?.price)
                        ? product?.price
                        : `$${product?.price}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pagination */}
          {/* <nav
            aria-label="Pagination"
            className="mx-auto mt-6 flex max-w-7xl justify-between px-4 text-sm font-medium text-gray-700 sm:px-6 lg:px-8"
          >
            <div className="min-w-0 flex-1">
              <a
                href="#"
                className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-themeColor-600 focus:outline-none focus:ring-2 focus:ring-themeColor-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-themeColor-600"
              >
                Previous
              </a>
            </div>
            <div className="hidden space-x-2 sm:flex">
              <a
                href="#"
                className="inline-flex h-10 items-center rounded-md border border-themeColor-600 ring-1 ring-themeColor-600 bg-white px-4 hover:bg-gray-100 focus:border-themeColor-600 focus:outline-none focus:ring-2 focus:ring-themeColor-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-themeColor-600"
              >
                1
              </a>
              <a
                href="#"
                className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-themeColor-600 focus:outline-none focus:ring-2 focus:ring-themeColor-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-themeColor-600"
              >
                2
              </a>
              <a
                href="#"
                className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-themeColor-600 focus:outline-none focus:ring-2 focus:ring-themeColor-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-themeColor-600"
              >
                3
              </a>
              <span className="inline-flex h-10 items-center px-1.5 text-gray-500">
                ...
              </span>
              <a
                href="#"
                className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-themeColor-600 focus:outline-none focus:ring-2 focus:ring-themeColor-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-themeColor-600"
              >
                8
              </a>
              <a
                href="#"
                className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-themeColor-600 focus:outline-none focus:ring-2 focus:ring-themeColor-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-themeColor-600"
              >
                9
              </a>
              <a
                href="#"
                className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-themeColor-600 focus:outline-none focus:ring-2 focus:ring-themeColor-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-themeColor-600"
              >
                10
              </a>
            </div>
            <div className="flex min-w-0 flex-1 justify-end">
              <a
                href="#"
                className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-100 focus:border-themeColor-600 focus:outline-none focus:ring-2 focus:ring-themeColor-600 focus:ring-opacity-25 focus:ring-offset-1 focus:ring-offset-themeColor-600"
              >
                Next
              </a>
            </div>
          </nav> */}
        </main>
      </div>
    </>
  );
}

export default Products;
