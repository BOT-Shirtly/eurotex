"use client";

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
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
  GlobeAltIcon,
} from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function AdminWebPages(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [tabs, setTabs] = useState([]);
  useEffect(() => {
    var userData = localStorage.getItem("__EurotexUser__");
    if (userData) {
      //setIsVisible(true);
      var userToken = JSON.parse(userData);
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/eurotex/admin/webpages`, {
          headers: {
            authorization: userToken?.authToken, // Replace with your actual token
          },
        })
        .then((response) => {
          if (response.data.success == undefined) {
            setIsVisible(false);
            setTabs(response?.data);
            for (var i = 0; i < response?.data?.length; i++) {
              if (props?.current == response?.data[i]?.name) {
                response.data[i].current = true;
              } else {
                response.data[i].current = false;
              }
            }
          } else {
            setIsVisible(false);
          }
        })
        .catch((error) => {
          setIsVisible(false);
        });
    } else {
      localStorage.removeItem("__EurotexUser__");
      window.location.replace("/");
    }
  }, []);

  return (
    <>
      {isVisible && <Loading />}
      <div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Web Pages
            </h1>
            <p className="mt-2 text-sm text-gray-700">Update Web Pages Data</p>
          </div>
        </div>
        <div>
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              defaultValue={tabs.find((tab) => tab?.current)?.name}
              className="block w-full rounded-md border-gray-300 focus:border-themeColor-500 focus:ring-themeColor-500"
            >
              {tabs.map((tab) => (
                <option key={tab?.name}>{tab?.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block mt-5">
            <div className="border-b border-gray-200">
              <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <a
                    key={tab?.name}
                    href={`/admin/webPages/${tab?.name}`}
                    aria-current={tab?.current ? "page" : undefined}
                    className={classNames(
                      tab?.current
                        ? "border-themeColor-500 text-themeColor-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium"
                    )}
                  >
                    <GlobeAltIcon
                      aria-hidden="true"
                      className={classNames(
                        tab?.current
                          ? "text-themeColor-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "-ml-0.5 mr-2 h-5 w-5"
                      )}
                    />
                    <span>{tab?.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminWebPages;
