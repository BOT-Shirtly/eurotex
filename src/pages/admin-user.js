import React, { Fragment, useState, useEffect } from "react";
import Loading from "components/loading";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import axios from "axios";

function AdminUsers() {
  const [isVisible, setIsVisible] = useState(false);

  const [people, setPeople] = useState([]);
  useEffect(() => {
    setIsVisible(true);
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/eurotex/admin/users`, {
        headers: {
          authorization: userData?.authToken, // Replace with your actual token
        },
      })
      .then((response) => {
        if (response.data.success == undefined) {
          setIsVisible(false);
          setPeople(response.data);
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
  const stringToBoolean = (str) => {
    return str.toLowerCase() === "true";
  };
  const updateUsers = (email, active) => {
    setIsVisible(true);
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/eurotex/admin/updateUser`,
        {
          email,
          active,
        },
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
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
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Users
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users including their name, title, email and
              role.
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Created On
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person, index) => (
                    <tr key={person?.email}>
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div className="h-11 w-11 flex-shrink-0">
                            <img
                              alt=""
                              src={`https://api.dicebear.com/9.x/initials/svg?seed=${person?.name}&radius=10`}
                              className="h-11 w-11 rounded-full"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {person?.name}
                            </div>
                            <div className="mt-1 text-gray-500">
                              {person?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="text-gray-900">{person?.country}</div>
                        <div className="mt-1 text-gray-500">
                          {person?.country == "CA" ? "Canada" : "United States"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {person?.active ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-green-600/20">
                            In-Active
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {person?.role}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {moment.unix(person?.createdAt).format("MMM Do, YYYY")}
                      </td>
                      <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        {person?.role == "Admin" ? (
                          <select
                            id="active"
                            name="active"
                            value={person?.active}
                            disabled={true}
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                          >
                            <option value={true}>Active</option>
                            <option value={false}>In-Active</option>
                          </select>
                        ) : (
                          <select
                            id="active"
                            name="active"
                            value={person?.active}
                            onChange={(e) => {
                              const updatedUsers = [...people];
                              updatedUsers[index] = {
                                ...people[index],
                                active: stringToBoolean(e.target.value),
                              };
                              setPeople(updatedUsers);
                              updateUsers(
                                person?.email,
                                stringToBoolean(e.target.value)
                              );
                            }}
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                          >
                            <option value={true}>Active</option>
                            <option value={false}>In-Active</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUsers;
