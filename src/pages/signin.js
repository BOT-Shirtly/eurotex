"use client";

import CryptoJS from "crypto-js";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ForgotPass from "../components/forgotPass";
import { useLocation } from "react-router-dom";
import Loading from "components/loading";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
function Signin() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: email,
    password: "",
  });
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData?.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };
  const handleSubmit = (e) => {
    setIsVisible(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setIsVisible(false);
      toast.error(validationErrors.name || validationErrors.email, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      const secretKey = process.env.REACT_APP_SECRET_KEY;
      formData.password = CryptoJS.AES.encrypt(
        formData.password,
        secretKey
      ).toString();
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/eurotex/signin`, formData)
        .then((response) => {
          if (response.data.success) {
            toast.success("Success !!", {
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
            localStorage.setItem(
              "__EurotexUser__",
              JSON.stringify(response.data)
            );
            if (response?.data?.role == "Admin") {
              window.location.replace("/admin/users");
            } else {
              window.location.replace("/");
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
            setFormData({
              ...formData,
              password: "",
            });
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
          setFormData({
            ...formData,
            password: "",
          });
        });
    }
  };
  return (
    <>
      {isVisible && <Loading />}
      <ForgotPass showModal={showModal} closeModal={closeModal} />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-28 lg:px-8">
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
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  type="email"
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    className="font-semibold text-themeColor-600 hover:text-themeColor-500 cursor-pointer"
                    onClick={openModal}
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
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

            <div>
              <button
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-themeColor-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
              >
                Sign In
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="/signup"
              className="font-semibold leading-6 text-themeColor-600 hover:text-themeColor-500"
            >
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signin;
