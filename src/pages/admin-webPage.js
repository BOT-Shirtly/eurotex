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

  const [footerData, setFooterData] = useState([]);
  const [editorValue, setEditorValue] = useState("");
  const [editorAboutValue, setEditorAboutValue] = useState("");
  const [editorTermsValue, setEditorTermsValue] = useState("");
  const [editorReturnValue, setEditorReturnValue] = useState("");
  const [editorShippingValue, setEditorShippingValue] = useState("");
  const [editorPrivacyValue, setEditorPrivacyValue] = useState("");
  const [editorContactValue, setEditorContactValue] = useState("");
  const [aboutIncentives, setAboutIncentives] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/eurotex/admin/webpages`,
        {
          webpage,
        },
        {
          headers: {
            authorization: userData?.authToken, // Replace with your actual token
          },
        }
      )
      .then((response) => {
        if (response.data.success == undefined) {
          setIsVisible(false);
          if (webpage == "Footer") {
            setFooterData(response.data);
            setEditorValue(
              response.data.filter(
                (section) => section.name === "Description"
              )[0]?.description
            );
          }
          if (webpage == "About") {
            setEditorAboutValue(response?.data[0]?.description);
            setAboutIncentives(response?.data[0]?.incentives);
          }
          if (webpage == "Contact") {
            setEditorContactValue(response?.data[0]?.description);
            setLocations(response?.data[0]?.locations);
          }
          if (webpage == "Terms") {
            setEditorTermsValue(response?.data[0]?.description);
          }
          if (webpage == "Return") {
            setEditorReturnValue(response?.data[0]?.description);
          }
          if (webpage == "Shipping") {
            setEditorShippingValue(response?.data[0]?.description);
          }
          if (webpage == "Privacy") {
            setEditorPrivacyValue(response?.data[0]?.description);
          }
        } else {
          setIsVisible(false);
        }
      })
      .catch((error) => {
        setIsVisible(false);
      });
  }, []);

  const [aboutData, setAboutData] = useState(
    footerData.filter((section) => section.name === "About")
  );
  const [catData, setCatData] = useState(
    footerData.filter((section) => section.name === "Category")
  );
  const [resData, setResData] = useState(
    footerData.filter((section) => section.name === "Resources")
  );

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };
  useEffect(() => {
    setAboutData(footerData.filter((section) => section.name === "About"));
    setCatData(footerData.filter((section) => section.name === "Category"));
    setResData(footerData.filter((section) => section.name === "Resources"));
  }, [footerData]);

  const addItem = (sectionName) => {
    const newItem = { title: "", href: "" };
    setFooterData((prevData) =>
      prevData.map((section) =>
        section.name === sectionName
          ? { ...section, items: [...section.items, newItem] }
          : section
      )
    );
  };
  const updateTitleItem = (sectionName, upDateIndex, newValue) => {
    setFooterData((prevData) =>
      prevData.map((section) =>
        section.name === sectionName
          ? {
              ...section,
              items: section.items.map((item, index) => {
                if (index === upDateIndex) {
                  return {
                    ...item,
                    title: newValue,
                  };
                }
                return item;
              }),
            }
          : section
      )
    );
  };
  const updateLinkItem = (sectionName, upDateIndex, newValue) => {
    setFooterData((prevData) =>
      prevData.map((section) =>
        section.name === sectionName
          ? {
              ...section,
              items: section.items.map((item, index) => {
                if (index === upDateIndex) {
                  return {
                    ...item,
                    href: newValue,
                  };
                }
                return item;
              }),
            }
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
  const saveFooterData = (webpage, sectionName) => {
    setIsVisible(true);
    if (sectionName == "Description") {
      var dataToUpdate = {};
      dataToUpdate.webpage = webpage;
      dataToUpdate.section = sectionName;
      dataToUpdate.description = editorValue;
    } else {
      var dataToUpdate = footerData.filter(
        (section) => section.name === sectionName
      )[0];
      delete dataToUpdate._id;
      dataToUpdate.webpage = webpage;
      dataToUpdate.section = sectionName;
    }

    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/eurotex/admin/webpages`,
        dataToUpdate,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Web Page Data Updated.", {
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

  const addAboutItem = () => {
    const newItem = { title: "", link: "", description: "", imageSrc: "" };
    setAboutIncentives([...aboutIncentives, newItem]);
  };
  const handleAboutChange = (index, field, value) => {
    const updatedData = aboutIncentives.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setAboutIncentives(updatedData); // Update the state with the modified array
  };
  const handleAboutEditorChange = (value) => {
    setEditorAboutValue(value);
  };
  const removeAboutItem = (indexToRemove) => {
    const updatedData = aboutIncentives.filter(
      (_, index) => index !== indexToRemove
    );
    setAboutIncentives(updatedData);
  };
  const saveAboutData = (webpage, sectionName) => {
    setIsVisible(true);
    var dataToUpdate = {
      webpage,
      sectionName,
      description: editorAboutValue,
      incentives: aboutIncentives,
    };
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/eurotex/admin/webpages`,
        dataToUpdate,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Web Page Data Updated.", {
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

  const handleTermsEditorChange = (value) => {
    setEditorTermsValue(value);
  };
  const saveTermsData = (webpage, sectionName) => {
    setIsVisible(true);
    var dataToUpdate = {
      webpage,
      sectionName,
      description: editorTermsValue,
    };
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/eurotex/admin/webpages`,
        dataToUpdate,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Web Page Data Updated.", {
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

  const handleReturnEditorChange = (value) => {
    setEditorReturnValue(value);
  };
  const saveReturnData = (webpage, sectionName) => {
    setIsVisible(true);
    var dataToUpdate = {
      webpage,
      sectionName,
      description: editorReturnValue,
    };
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/eurotex/admin/webpages`,
        dataToUpdate,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Web Page Data Updated.", {
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

  const handleShippingEditorChange = (value) => {
    setEditorShippingValue(value);
  };
  const saveShippingData = (webpage, sectionName) => {
    setIsVisible(true);
    var dataToUpdate = {
      webpage,
      sectionName,
      description: editorShippingValue,
    };
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/eurotex/admin/webpages`,
        dataToUpdate,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Web Page Data Updated.", {
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

  const handlePrivacyEditorChange = (value) => {
    setEditorPrivacyValue(value);
  };
  const savePrivacyData = (webpage, sectionName) => {
    setIsVisible(true);
    var dataToUpdate = {
      webpage,
      sectionName,
      description: editorPrivacyValue,
    };
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/eurotex/admin/webpages`,
        dataToUpdate,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Web Page Data Updated.", {
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

  const addContactItem = () => {
    const newItem = { address: "" };
    setLocations([...locations, newItem]);
  };
  const handleContactChange = (index, field, value) => {
    const updatedData = locations.map((item, i) =>
      i === index ? { ...item, address: value } : item
    );
    setLocations(updatedData); // Update the state with the modified array
  };
  const handleContactEditorChange = (value) => {
    setEditorContactValue(value);
  };
  const removeContactItem = (indexToRemove) => {
    const updatedData = locations.filter((_, index) => index !== indexToRemove);
    setLocations(updatedData);
  };
  const saveContactData = (webpage, sectionName) => {
    setIsVisible(true);
    var dataToUpdate = {
      webpage,
      sectionName,
      description: editorContactValue,
      locations: locations,
    };
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/eurotex/admin/webpages`,
        dataToUpdate,
        {
          headers: {
            authorization: userData?.authToken, // Replace with your token
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Web Page Data Updated.", {
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

        {webpage == "Footer" ? (
          <div className="mt-5 py-5">
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Footer Description
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in footer under Logo
                    'Description'.
                  </p>
                </div>
                <div>
                  <ReactQuill
                    value={editorValue}
                    modules={modules}
                    onChange={handleEditorChange}
                    placeholder="Write something amazing..."
                    className="mt-2 rounded-md"
                  />

                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveFooterData(webpage, "Description");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
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
                      className="grid gap-x-2 gap-y-2 grid-cols-6 mb-5 relative border-dashed border-2 p-3 rounded-lg"
                      key={`${about.name}-${i}`}
                    >
                      {aboutData[0]?.items.length > 1 ? (
                        <TrashIcon
                          className="h-4 w-4 text-gray-400 absolute top-1 right-1 cursor-pointer hover:text-red-500"
                          onClick={() => removeItemAtIndex("About", i)}
                        />
                      ) : null}
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={about?.title}
                            onChange={(e) => {
                              updateTitleItem("About", i, e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Link
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={about?.href}
                            onChange={(e) => {
                              updateLinkItem("About", i, e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center border-dashed border-2 p-3 rounded-lg">
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
                        className="inline-flex items-center rounded-md bg-themeColor-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveFooterData(webpage, "About");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
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
                      className="grid gap-x-2 gap-y-2 grid-cols-6 mb-5 relative border-dashed border-2 p-3 rounded-lg"
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
                            value={about?.title}
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
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
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center border-dashed border-2 p-3 rounded-lg">
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
                        className="inline-flex items-center rounded-md bg-themeColor-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveFooterData(webpage, "Category");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
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
                      className="grid gap-x-2 gap-y-2 grid-cols-6 mb-5 relative border-dashed border-2 p-3 rounded-lg"
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
                            value={about?.title}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
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
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center border-dashed border-2 p-3 rounded-lg">
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
                        className="inline-flex items-center rounded-md bg-themeColor-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveFooterData(webpage, "Resources");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {webpage == "About" ? (
          <div className="mt-5 py-5">
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    About Description
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in footer under Logo
                    'Description'.
                  </p>
                </div>
                <div>
                  <ReactQuill
                    value={editorAboutValue}
                    modules={modules}
                    onChange={handleAboutEditorChange}
                    placeholder="Write something amazing..."
                    className="mt-2 rounded-md"
                  />

                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveAboutData(webpage, "Description");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Partners
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in 'About' under partners.
                  </p>
                </div>
                <div>
                  {aboutIncentives?.map((about, i) => (
                    <div
                      className="grid gap-x-2 gap-y-2 grid-cols-6 mb-5 relative border-dashed border-2 p-3 rounded-lg"
                      key={`${about.title}-${i}`}
                    >
                      {aboutIncentives.length > 1 ? (
                        <TrashIcon
                          className="h-4 w-4 text-gray-400 absolute top-1 right-1 cursor-pointer hover:text-red-500"
                          onClick={() => removeAboutItem(i)}
                        />
                      ) : null}
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={about?.title}
                            onChange={(e) => {
                              handleAboutChange(i, "title", e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Link
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={about?.link}
                            onChange={(e) => {
                              handleAboutChange(i, "link", e.target.value);
                            }}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="comment"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Description
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="comment"
                            rows={4}
                            onChange={(e) => {
                              handleAboutChange(
                                i,
                                "description",
                                e.target.value
                              );
                            }}
                            value={about?.description}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6 flex items-center gap-x-3">
                        <div className="h-11 w-11 flex-shrink-0">
                          <img
                            alt={about?.title}
                            src={`${about?.imageSrc}`}
                            className="h-11 w-11 bg-white object-contain ring-1 ring-gray-900/10"
                          />
                        </div>
                        <div className="w-full">
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            Image Link
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              value={about?.imageSrc}
                              onChange={(e) => {
                                handleAboutChange(
                                  i,
                                  "imageSrc",
                                  e.target.value
                                );
                              }}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center border-dashed border-2 p-3 rounded-lg">
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      Add New Partner
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add new Partner to About Page
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          addAboutItem("About");
                        }}
                        className="inline-flex items-center rounded-md bg-themeColor-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveAboutData(webpage, "Description");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {webpage == "Terms" ? (
          <div className="mt-5 py-5">
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Terms & Conditions
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in Terms & Conditions
                  </p>
                </div>
                <div>
                  <ReactQuill
                    value={editorTermsValue}
                    modules={modules}
                    onChange={handleTermsEditorChange}
                    placeholder="Write something amazing..."
                    className="mt-2 rounded-md"
                  />

                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveTermsData(webpage, "Terms");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {webpage == "Return" ? (
          <div className="mt-5 py-5">
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Return Policy
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in Return Policy
                  </p>
                </div>
                <div>
                  <ReactQuill
                    value={editorReturnValue}
                    modules={modules}
                    onChange={handleReturnEditorChange}
                    placeholder="Write something amazing..."
                    className="mt-2 rounded-md"
                  />

                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveReturnData(webpage, "Return");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {webpage == "Shipping" ? (
          <div className="mt-5 py-5">
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Shipping Policy
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in Shipping Policy
                  </p>
                </div>
                <div>
                  <ReactQuill
                    value={editorShippingValue}
                    modules={modules}
                    onChange={handleShippingEditorChange}
                    placeholder="Write something amazing..."
                    className="mt-2 rounded-md"
                  />

                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveShippingData(webpage, "Return");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {webpage == "Privacy" ? (
          <div className="mt-5 py-5">
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Privacy Policy
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in Privacy Policy
                  </p>
                </div>
                <div>
                  <ReactQuill
                    value={editorPrivacyValue}
                    modules={modules}
                    onChange={handlePrivacyEditorChange}
                    placeholder="Write something amazing..."
                    className="mt-2 rounded-md"
                  />

                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        savePrivacyData(webpage, "Privacy");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {webpage == "Contact" ? (
          <div className="mt-5 py-5">
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Contact Description
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in Contact page
                  </p>
                </div>
                <div>
                  <ReactQuill
                    value={editorContactValue}
                    modules={modules}
                    onChange={handleContactEditorChange}
                    placeholder="Write something amazing..."
                    className="mt-2 rounded-md"
                  />

                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveContactData(webpage, "Contact");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-2">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Locations
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    These details will be shown in 'Contact' under locations.
                  </p>
                </div>
                <div>
                  {locations?.map((about, i) => (
                    <div
                      className="grid gap-x-2 gap-y-2 grid-cols-6 mb-5 relative border-dashed border-2 p-3 rounded-lg"
                      key={`${i}`}
                    >
                      {locations.length > 1 ? (
                        <TrashIcon
                          className="h-4 w-4 text-gray-400 absolute top-1 right-1 cursor-pointer hover:text-red-500"
                          onClick={() => removeContactItem(i)}
                        />
                      ) : null}
                      <div className="sm:col-span-6">
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Location
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="address"
                            rows={4}
                            onChange={(e) => {
                              handleContactChange(i, "address", e.target.value);
                            }}
                            value={about?.address}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center border-dashed border-2 p-3 rounded-lg">
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      Add New Location
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add new Location to Contact Page
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={addContactItem}
                        className="inline-flex items-center rounded-md bg-themeColor-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        saveContactData(webpage, "Contact");
                      }}
                      className="block w-full rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                    >
                      Save
                    </button>
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
