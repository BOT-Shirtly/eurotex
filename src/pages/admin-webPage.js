import React, { useState, useEffect } from "react";
import Loading from "components/loading";
import { PhotoIcon, TrashIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Description, Field, Label, Switch } from "@headlessui/react";
import CloudinaryUploadWidget from "../components/cloudinaryUploadWidget";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminWebPages from "./admin-webPages";

// Function to generate all combinations

function Product() {
  const [isVisible, setIsVisible] = useState(false);
  const { webpage } = useParams();

  const [footerData, setFooterData] = useState([
    {
      name: "About",
      items: [
        { name: "Contact Us", href: "/contact" },
        {
          name: "Ontario Office: 122 Middleton Street, Brantford ON N3S7V7 Canada",
          href: "https://www.google.com/maps/place/122+Middleton+St,+Brantford,+ON+N3S+7V7/@43.1624998,-80.2291992,17z/data=!3m1!4b1!4m6!3m5!1s0x882c644a1d829d8d:0xae4f1d514781029d!8m2!3d43.1624959!4d-80.2266243!16s%2Fg%2F11gk4pcch2?entry=ttu&g_ep=EgoyMDI0MDgyNy4wIKXMDSoASAFQAw%3D%3D",
        },
        {
          name: "Email: info@eurotex.com",
          href: "mailto:info@eurotex.com",
        },
      ],
    },
    {
      name: "Category",
      items: [
        { name: "DTF Printer", href: "/products" },
        { name: "DTF Inks", href: "/products" },
        { name: "DTF Films", href: "/products" },
        { name: "DTF Powder", href: "/products" },
      ],
    },
    {
      name: "Resources",
      items: [
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Shipping", href: "/shipping" },
        { name: "Return & Refund", href: "/return-refund" },
      ],
    },
  ]);

  const [aboutData, setAboutData] = useState(
    footerData.filter((section) => section.name === "About")
  );
  const [catData, setCatData] = useState(
    footerData.filter((section) => section.name === "Category")
  );
  const [resData, setResData] = useState(
    footerData.filter((section) => section.name === "Resources")
  );

  useEffect(() => {
    setAboutData(footerData.filter((section) => section.name === "About"));
    setCatData(footerData.filter((section) => section.name === "Category"));
    setResData(footerData.filter((section) => section.name === "Resources"));
  }, [footerData]);

  const addItem = (sectionName) => {
    const newItem = { name: "", href: "" };
    setFooterData((prevData) =>
      prevData.map((section) =>
        section.name === sectionName
          ? { ...section, items: [...section.items, newItem] }
          : section
      )
    );
  };

  const removeItemAtIndex = (sectionName, indexToRemove) => {
    setFooterData((prevData) =>
      prevData.map((section) =>
        section.name === sectionName
          ? {
              ...section,
              items: section.items.filter(
                (_, index) => index !== indexToRemove
              ),
            }
          : section
      )
    );
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };
  return (
    <>
      {isVisible && <Loading />}
      <div className="px-4 sm:px-6 lg:px-8">
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
        <AdminWebPages current={webpage} />
        <div className="space-y-12 mt-5">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                {webpage}
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Update Page UI components.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="block rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        {webpage == "Footer" ? (
          <div className="border-t mt-5 py-5">
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    About
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in footer under 'About'.
                  </p>
                </div>
                <div>
                  {aboutData[0]?.items?.map((about, i) => (
                    <div
                      className="grid gap-x-2 gap-y-2 grid-cols-6 mb-5 relative"
                      key={`${about.name}-${i}`}
                    >
                      {aboutData[0]?.items.length > 1 ? (
                        <TrashIcon
                          className="h-4 w-4 text-gray-400 absolute top-1 right-1 cursor-pointer hover:text-red-500"
                          onClick={() => removeItemAtIndex("About", i)}
                        />
                      ) : null}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={about?.name}
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Link
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={about?.href}
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center border-dashed border-2 py-5">
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      Add New Link
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add new Link to About section Footer
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          addItem("About");
                        }}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Category
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in footer under 'Category'.
                  </p>
                </div>

                <div>
                  {catData[0]?.items?.map((about, i) => (
                    <div
                      className="grid gap-x-2 gap-y-2 grid-cols-6 mb-5 relative"
                      key={`${about.name}-${i}`}
                    >
                      {catData[0]?.items.length > 1 ? (
                        <TrashIcon
                          className="h-4 w-4 text-gray-400 absolute top-1 right-1 cursor-pointer hover:text-red-500"
                          onClick={() => removeItemAtIndex("Category", i)}
                        />
                      ) : null}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={about?.name}
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Link
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={about?.href}
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center border-dashed border-2 py-5">
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      Add New Link
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add new Link to About section Footer
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          addItem("Category");
                        }}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Resources
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in footer under 'Resources'.
                  </p>
                </div>
                <div>
                  {resData[0]?.items?.map((about, i) => (
                    <div
                      className="grid gap-x-2 gap-y-2 grid-cols-6 mb-5 relative"
                      key={`${about.name}-${i}`}
                    >
                      {resData[0]?.items.length > 1 ? (
                        <TrashIcon
                          className="h-4 w-4 text-gray-400 absolute top-1 right-1 cursor-pointer hover:text-red-500"
                          onClick={() => removeItemAtIndex("Resources", i)}
                        />
                      ) : null}
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={about?.name}
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Link
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={about?.href}
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center border-dashed border-2 py-5">
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      Add New Link
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add new Link to Resources section Footer
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          addItem("Resources");
                        }}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
export default Product;
