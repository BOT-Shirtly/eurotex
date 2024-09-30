"use client";
import React, { Fragment, useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Loading from "components/loading";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

const Profile = ({ showModal, closeModal }) => {
  const [formData, setFormData] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    const userData = localStorage.getItem("__EurotexUser__");
    if (userData) {
      setFormData(JSON.parse(userData));
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem("__EurotexUser__");
    window.location.replace("/");
  };
  const updateData = () => {
    setIsVisible(true);
    if (formData.password) {
      const secretKey = process.env.REACT_APP_SECRET_KEY;
      formData.password = CryptoJS.AES.encrypt(
        formData.password,
        secretKey
      ).toString();
    }

    var updateData = {
      name: formData?.name,
      bio: formData?.bio,
      password: formData?.password,
    };
    axios
      .put(`${process.env.REACT_APP_BASE_URL}/eurotex/updateUser`, updateData, {
        headers: {
          authorization: formData?.authToken, // Replace with your token
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast.success("Information Updated.", {
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
          setFormData({
            ...formData,
            password: "",
          });
          delete formData?.password;
          localStorage.setItem("__EurotexUser__", JSON.stringify(formData));
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
          localStorage.removeItem("__EurotexUser__");
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
        localStorage.removeItem("__EurotexUser__");
        window.location.replace("/");
      });
  };
  return (
    <>
      {isVisible && <Loading />}
      <Dialog open={showModal} onClose={closeModal} className="relative z-10">
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
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2
                        id="slide-over-heading"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Profile
                      </h2>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => closeModal(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-themeColor-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Main */}
                  <div>
                    <div className="pb-1 sm:pb-6">
                      <div>
                        <div className="relative h-40 sm:h-56">
                          <img
                            alt=""
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${formData?.name}&radius=10`}
                            className="absolute h-full w-full object-cover"
                          />
                        </div>
                        <div className="mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6">
                          <div className="sm:flex-1">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                  {formData?.name}
                                </h3>
                                <span className="ml-2.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400">
                                  <span className="sr-only">Online</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-5 pt-5 sm:px-0 sm:pt-0">
                      <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                        {/* Name */}
                        <div className="sm:grid sm:grid-cols-3">
                          <div>
                            <label
                              htmlFor="project-name"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Name
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              id="name"
                              name="name"
                              value={formData.name}
                              type="text"
                              onChange={handleChange}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3">
                          <div>
                            <label
                              htmlFor="project-description"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Bio
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <textarea
                              id="bio"
                              name="bio"
                              value={formData.bio}
                              type="text"
                              onChange={handleChange}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3">
                          <div>
                            <label
                              htmlFor="project-name"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Email
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              id="email"
                              name="email"
                              value={formData.email}
                              type="email"
                              disabled={true}
                              onChange={handleChange}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="sm:grid sm:grid-cols-3">
                          <div>
                            <label
                              htmlFor="project-name"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Password
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              id="password"
                              name="password"
                              value={formData.password}
                              type="password"
                              onChange={handleChange}
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0">
                          <button
                            onClick={updateData}
                            type="button"
                            className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-themeColor-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600 sm:flex-1"
                          >
                            Update
                          </button>
                          <button
                            onClick={signOut}
                            type="button"
                            className="inline-flex w-full flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default Profile;
