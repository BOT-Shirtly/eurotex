import React, { useState, useEffect } from "react";
import Loading from "components/loading";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { Description, Field, Label, Switch } from "@headlessui/react";
import CloudinaryUploadWidget from "../components/cloudinaryUploadWidget";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function AdminProductNew() {
  const [isVisible, setIsVisible] = useState(false);
  const [prodData, setProdData] = useState({
    prodId: moment().unix(),
  });
  const [prodDataImages, setProdDataImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [details, setDetails] = useState([]);
  const [combination, setCombination] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [combinations, setCombinations] = useState([]);
  const [editorValue, setEditorValue] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [tagsArray, setTagsArray] = useState([]);
  const stringToBoolean = (str) => {
    return str.toLowerCase() === "true";
  };
  useEffect(() => {
    setIsVisible(true);
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/eurotex/categories`, {
        headers: {
          authorization: userData?.authToken, // Replace with your actual token
        },
      })
      .then(async (response) => {
        if (response.data.success == undefined) {
          setCategories(response.data);
          setIsVisible(false);
        } else {
          setIsVisible(false);
        }
      })
      .catch((error) => {
        setIsVisible(false);
      });
  }, []);
  useEffect(() => {
    function combineVariants(variants) {
      const combine = (index, currentCombination) => {
        if (index === variants.length) {
          combinations.push({
            name: currentCombination.join(" | "),
            inStock: true,
            price: prodData?.price,
          });
          return;
        }

        const variant = variants[index];
        variant.value.forEach((variantValue) => {
          combine(index + 1, [...currentCombination, variantValue.name]);
        });
      };

      const combinations = [];
      combine(0, []);
      return combinations;
    }
    const result = combineVariants(variants);
    function findMatchingObject(combinations, result) {
      for (var i = 0; i < result.length; i++) {
        var resultName = result[i].name;
        for (var j = 0; j < combinations.length; j++) {
          if (resultName === combinations[j].name) {
            result[i].inStock = combinations[j].inStock;
            result[i].price = combinations[j].price;
          }
        }
      }
      return result;
    }
    const matchedObjects = findMatchingObject(combinations, result);
    setCombinations(matchedObjects);
  }, [variants]);

  const addVariantValue = (variantIndex, newValue) => {
    const updatedVariants = variants.map((variant, index) => {
      if (index === variantIndex) {
        return {
          ...variant,
          value: [...variant.value, newValue],
        };
      }
      return variant;
    });
    setVariants(updatedVariants);
  };
  const updateVariantValue = (variantIndex, valueIndex, newValue) => {
    const updatedVariants = variants.map((variant, index) => {
      if (index === variantIndex) {
        const updatedValues = variant.value.map((item, idx) =>
          idx === valueIndex ? newValue : item
        );
        return {
          ...variant,
          value: updatedValues,
        };
      }
      return variant;
    });
    setVariants(updatedVariants);
  };
  const deleteVariantValue = (variantIndex, valueIndex) => {
    const updatedVariants = variants.map((variant, index) => {
      if (index === variantIndex) {
        const updatedValues = variant.value.filter(
          (_, idx) => idx !== valueIndex
        );
        return {
          ...variant,
          value: updatedValues,
        };
      }
      return variant;
    });
    setVariants(updatedVariants);
  };
  const addNewVariant = (newVariant) => {
    setVariants([...variants, newVariant]);
  };
  const updateVariant = (variantIndex, newValue) => {
    const updatedVariants = variants.map((variant, index) => {
      if (index === variantIndex) {
        return {
          ...variant,
          name: newValue,
        };
      }
      return variant;
    });
    setVariants(updatedVariants);
  };
  const deleteVariant = (variantIndex) => {
    const updatedVariants = variants.filter(
      (_, index) => index !== variantIndex
    );
    setVariants(updatedVariants);
  };

  const addDetailValue = (variantIndex, newValue) => {
    const updatedVariants = details.map((variant, index) => {
      if (index === variantIndex) {
        variant.items.push(newValue);
        return {
          ...variant,
          items: variant.items,
        };
      }
      return variant;
    });
    setDetails(updatedVariants);
  };
  const updateDetailValue = (variantIndex, valueIndex, newValue) => {
    const updatedVariants = details.map((variant, index) => {
      if (index === variantIndex) {
        const updatedItems = variant.items.map((item, i) =>
          i === valueIndex ? newValue : item
        );
        return {
          ...variant,
          items: updatedItems,
        };
      }
      return variant;
    });
    setDetails(updatedVariants);
  };
  const deleteDetailValue = (variantIndex, valueIndex) => {
    const updatedVariants = details.map((variant, index) => {
      if (index === variantIndex) {
        const updatedValues = variant.items.filter(
          (_, idx) => idx !== valueIndex
        );
        return {
          ...variant,
          items: updatedValues,
        };
      }
      return variant;
    });
    setDetails(updatedVariants);
  };
  const addNewDetail = (newVariant) => {
    setDetails([...details, newVariant]);
  };
  const deleteDetail = (variantIndex) => {
    const updatedVariants = details.filter(
      (_, index) => index !== variantIndex
    );
    setDetails(updatedVariants);
  };
  const updateDetail = (variantIndex, newValue) => {
    const updatedVariants = details.map((variant, index) => {
      if (index === variantIndex) {
        return {
          ...variant,
          name: newValue,
        };
      }
      return variant;
    });
    setDetails(updatedVariants);
  };

  const updatePriceCombination = (variantIndex, newValue) => {
    const updatedVariants = combinations.map((variant, index) => {
      if (index === variantIndex) {
        return {
          ...variant,
          price: newValue,
        };
      }
      return variant;
    });
    setCombinations(updatedVariants);
  };
  const updateStockCombination = (variantIndex, newValue) => {
    const updatedVariants = combinations.map((variant, index) => {
      if (index === variantIndex) {
        return {
          ...variant,
          inStock: stringToBoolean(newValue),
        };
      }
      return variant;
    });
    setCombinations(updatedVariants);
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  const addProduct = (str) => {
    prodData.images = prodDataImages;
    prodData.variants = variants;
    prodData.details = details;
    prodData.description = editorValue;
    prodData.active = enabled;
    prodData.combinations = combination;
    prodData.tagsArray = tagsArray;
    setProdData(prodData);
    setIsVisible(true);
    const userData = JSON.parse(localStorage.getItem("__EurotexUser__"));
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/eurotex/product`, prodData, {
        headers: {
          authorization: userData?.authToken, // Replace with your token
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast.success("Product Added.", {
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
        <div className="space-y-12">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Product Information
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                This information will be displayed publicly so be careful what
                you add.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={addProduct}
                className="block rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="border-gray-900/10 pb-12">
            <div className="bg-white shadow sm:rounded-lg">
              <Field className="px-4 py-5 sm:p-6">
                <Label
                  as="h3"
                  passive
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  Product is {enabled ? "Active" : "In-Active"}
                </Label>
                <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                  <div className="max-w-xl text-sm text-gray-500">
                    <Description>
                      Admin can active or in-active product from the online
                      store.
                    </Description>
                  </div>
                  <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                    <Switch
                      checked={enabled}
                      onChange={setEnabled}
                      className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-themeColor-600 focus:ring-offset-2 data-[checked]:bg-themeColor-600"
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                      />
                    </Switch>
                  </div>
                </div>
              </Field>
            </div>
            <div className="sm:col-span-3 mt-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Product Name (Max. 30 char.)
              </label>
              <p className="truncate text-sm text-gray-500">
                {prodData?.href
                  ? `SEO Url: https://kingjetprinters.com${prodData?.href}`
                  : null}
              </p>
              <div className="mt-2">
                <input
                  id="prodName"
                  name="prodName"
                  value={prodData?.name}
                  onChange={(e) => {
                    setProdData({
                      ...prodData,
                      name: e.target.value,
                      id: e.target.value?.split(" ")?.join("-"),
                      href: `/products/${e.target.value
                        ?.split(" ")
                        ?.join("-")}`,
                    });
                  }}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-3 mt-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Price (CAD)
              </label>
              <div className="mt-2">
                <input
                  id="prodPrice"
                  name="prodPrice"
                  value={prodData?.price}
                  onChange={(e) => {
                    setProdData({
                      ...prodData,
                      price: e.target.value,
                    });
                  }}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-3 mt-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <ReactQuill
                value={editorValue}
                modules={modules}
                onChange={handleEditorChange}
                placeholder="Write something amazing..."
                className="mt-2 rounded-md"
              />
            </div>
            <div className="sm:col-span-3 mt-5">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Category
              </label>
              <select
                onChange={(e) => {
                  setProdData({
                    ...prodData,
                    category: e.target.value,
                  });
                }}
                value={prodData?.category}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-themeColor-600 sm:text-sm sm:leading-6"
              >
                {categories?.map((cat, i) => (
                  <option ley={i} value={cat?.name}>
                    {cat?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3 mt-5">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tags
              </label>
              <div className="mt-2 flex item-center">
                <input
                  id="tag"
                  name="tag"
                  type="text"
                  value={tagValue}
                  onChange={(e) => setTagValue(e.target.value)}
                  placeholder="Add Tag"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (tagValue != "") {
                      if (tagsArray.indexOf(tagValue) < 0) {
                        tagsArray.push(tagValue);
                        setTagsArray(tagsArray);
                        setTagValue("");
                      }
                    }
                  }}
                  className="block w-24 ml-5 rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                >
                  Add Tag
                </button>
              </div>
              <div className="mt-5">
                {tagsArray?.length > 0
                  ? tagsArray?.map((tag, i) => {
                      return (
                        <span
                          key={i}
                          className="ml-2 inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                        >
                          <svg
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                            className="h-1.5 w-1.5 fill-red-500"
                          >
                            <circle r={3} cx={3} cy={3} />
                          </svg>
                          {tag}
                        </span>
                      );
                    })
                  : null}
              </div>
            </div>

            {/* Features */}
            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">
                  More Details
                </span>
              </div>
            </div>
            <div className="sm:flex sm:items-center mt-5">
              <div className="sm:flex-auto">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Details (Multiline features, specifications etc.)
                </label>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  onClick={() => {
                    addNewDetail({
                      name: "Detail Name",
                      items: ["Details Information"],
                    });
                  }}
                  className="block rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                >
                  Add Detail
                </button>
              </div>
            </div>
            {details.map((variant, variantIndex) => (
              <div
                key={variantIndex}
                className="mt-5 relative rounded-lg border border-gray-300 bg-white shadow-sm p-5"
              >
                <TrashIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-gray-400 absolute top-1 right-1 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    deleteDetail(variantIndex);
                  }}
                />
                <div className="flex rounded-md w-full">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                    Detail
                  </span>
                  <input
                    value={variant.name}
                    onChange={(e) => {
                      updateDetail(variantIndex, e.target.value);
                    }}
                    className="block w-full rounded-none rounded-r-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-1">
                  {variant.items.map((item, valueIndex) => (
                    <li
                      key={valueIndex}
                      className="col-span-1 flex rounded-md relative"
                    >
                      <TrashIcon
                        aria-hidden="true"
                        className="h-4 w-4 text-gray-400 absolute top-4 left-1 cursor-pointer hover:text-red-500"
                        onClick={() =>
                          deleteDetailValue(variantIndex, valueIndex)
                        }
                      />
                      <div className="mt-2 flex rounded-md w-full pl-7">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                          {`${valueIndex + 1}`}
                        </span>
                        <input
                          value={item}
                          onChange={(e) => {
                            updateDetailValue(
                              variantIndex,
                              valueIndex,
                              e.target.value
                            );
                          }}
                          className="block w-full rounded-none rounded-r-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </li>
                  ))}
                  <button
                    type="button"
                    className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-1 text-center hover:border-gray-400"
                    onClick={() => {
                      addDetailValue(variantIndex, "New Detail");
                    }}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                      className="mx-auto h-8 w-8 text-gray-400"
                    >
                      <path
                        d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mt-1 block text-xs text-gray-900">
                      Add Detail Value
                    </span>
                  </button>
                </ul>
              </div>
            ))}
            <button
              type="button"
              className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 mt-5"
              onClick={() => {
                setDetails([
                  ...details,
                  {
                    name: "New Feature",
                    items: ["New Detail"],
                  },
                ]);
              }}
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                aria-hidden="true"
                className="mx-auto h-12 w-12 text-gray-400"
              >
                <path
                  d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mt-2 block text-sm font-semibold text-gray-900">
                Add more details
              </span>
            </button>
            {/* Media Files */}
            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">
                  Media Files
                </span>
              </div>
            </div>
            <div className="col-span-full mt-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Default Product Picture
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <div className="h-11 w-11 flex-shrink-0">
                  {!prodData?.imageSrc ? (
                    <PhotoIcon />
                  ) : (
                    <img
                      alt={prodData?.imageAlt}
                      src={`${prodData?.imageSrc}`}
                      className="h-11 w-11 bg-white object-contain ring-1 ring-gray-900/10"
                    />
                  )}
                </div>
                <CloudinaryUploadWidget
                  prodData={prodData}
                  setProdData={setProdData}
                  folder={`KingJetPrinters/Products/${prodData?.prodId}`}
                />
              </div>
            </div>
            <div className="sm:col-span-3 mt-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Default Image Alt Text (Good for SEO)
              </label>
              <div className="mt-2">
                <input
                  id="imageAlt"
                  name="imageAlt"
                  value={prodData?.imageAlt}
                  onChange={(e) => {
                    setProdData({
                      ...prodData,
                      imageAlt: e.target.value,
                    });
                  }}
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:flex sm:items-center mt-5">
              <div className="sm:flex-auto">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  More Media (Images & Videos)
                </label>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  onClick={() => {
                    setProdDataImages([
                      ...prodDataImages,
                      {
                        id: Number(prodDataImages?.length) + 1,
                        type: "",
                        name: "",
                        src: "",
                        link: "",
                        alt: "",
                      },
                    ]);
                  }}
                  className="block rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                >
                  Add Media
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 mt-5">
              {prodDataImages.map((image, index) => (
                <div
                  key={image?.id}
                  className="relative items-center rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-themeColor-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <TrashIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400 absolute top-1 right-1 cursor-pointer hover:text-red-500"
                    onClick={() => {
                      const updatedItems = prodDataImages.filter(
                        (_, i) => i !== index
                      );
                      setProdDataImages(updatedItems);
                    }}
                  />
                  <div className="sm:col-span-3">
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Media Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        defaultValue={image?.type}
                        onChange={(e) => {
                          var newValues = { type: e.target.value };
                          const updatedItems = prodDataImages.map((item, i) =>
                            i === index ? { ...item, ...newValues } : item
                          );
                          setProdDataImages(updatedItems);
                        }}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                      >
                        <option value={"image"}>Image</option>
                        <option value={"video"}>Video</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-5">
                    {image?.type === "image" ? (
                      <div className="mt-2 flex items-center gap-x-3">
                        <div className="h-11 w-11 flex-shrink-0">
                          {image?.src === "" ? (
                            <PhotoIcon />
                          ) : (
                            <img
                              alt={image?.alt}
                              src={`${image?.src}`}
                              className="h-11 w-11 bg-white object-contain ring-1 ring-gray-900/10"
                            />
                          )}
                        </div>
                        <CloudinaryUploadWidget
                          index={index}
                          prodDataImages={prodDataImages}
                          setProdDataImages={setProdDataImages}
                          folder={`KingJetPrinters/Products/${prodData?.prodId}`}
                        />
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-x-3">
                        <div className="h-11 w-11 flex-shrink-0">
                          {image?.src === "" ? (
                            <PhotoIcon />
                          ) : (
                            <img
                              alt={image?.alt}
                              src={`${image?.src}`}
                              className="h-11 w-11 bg-white object-contain ring-1 ring-gray-900/10"
                            />
                          )}
                        </div>

                        <div className="w-full">
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            Youtube Video Link Code
                          </label>
                          {image?.type === "video" ? (
                            <p className="truncate text-sm text-gray-500">
                              {image?.link}
                            </p>
                          ) : null}

                          <div className="mt-2">
                            <input
                              id="videoLink"
                              name="videoLink"
                              value={image?.link?.split("/embed/")[1]}
                              onChange={(e) => {
                                var newValues = {
                                  link:
                                    "https://www.youtube.com/embed/" +
                                    e.target.value,
                                  src: `https://img.youtube.com/vi/${e.target.value}/default.jpg`,
                                };
                                const updatedItems = prodDataImages.map(
                                  (item, i) =>
                                    i === index
                                      ? { ...item, ...newValues }
                                      : item
                                );
                                setProdDataImages(updatedItems);
                              }}
                              type="text"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-3 mt-5">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {image?.type === "image"
                        ? "Image"
                        : image?.type === "video"
                        ? "Video"
                        : "NA"}{" "}
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="moreimageName"
                        name="moreimageName"
                        value={image?.name}
                        onChange={(e) => {
                          var newValues = { name: e.target.value };
                          const updatedItems = prodDataImages.map((item, i) =>
                            i === index ? { ...item, ...newValues } : item
                          );
                          setProdDataImages(updatedItems);
                        }}
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3 mt-5">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {image?.type === "image"
                        ? "Image"
                        : image?.type === "video"
                        ? "Video"
                        : "NA"}{" "}
                      Alt Text (Good for SEO)
                    </label>
                    <div className="mt-2">
                      <input
                        id="moreimageAlt"
                        name="moreimageAlt"
                        value={image?.alt}
                        onChange={(e) => {
                          var newValues = { alt: e.target.value };
                          const updatedItems = prodDataImages.map((item, i) =>
                            i === index ? { ...item, ...newValues } : item
                          );
                          setProdDataImages(updatedItems);
                        }}
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400"
                onClick={() => {
                  setProdDataImages([
                    ...prodDataImages,
                    {
                      id: Number(prodDataImages?.length) + 1,
                      type: "image",
                      name: "",
                      src: "",
                      link: "",
                      alt: "",
                    },
                  ]);
                }}
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  className="mx-auto h-12 w-12 text-gray-400"
                >
                  <path
                    d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Add more media
                </span>
              </button>
            </div>
            {/* Variant */}
            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">
                  Variants
                </span>
              </div>
            </div>
            <div className="sm:flex sm:items-center mt-5">
              <div className="sm:flex-auto">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Variants (Size, Color, etc.)
                </label>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  onClick={() => {
                    addNewVariant({
                      name: "New Variant",
                      value: [{ name: "Value 1", inStock: true }],
                    });
                  }}
                  className="block rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
                >
                  Add Variants
                </button>
              </div>
            </div>
            {variants.map((variant, variantIndex) => (
              <div
                key={variantIndex}
                className="mt-5 relative rounded-lg border border-gray-300 bg-white shadow-sm p-5"
              >
                <TrashIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-gray-400 absolute top-1 right-1 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    deleteVariant(variantIndex);
                  }}
                />
                <div className="flex rounded-md w-full">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                    Variant
                  </span>
                  <input
                    value={variant.name}
                    onChange={(e) => {
                      updateVariant(variantIndex, e.target.value);
                    }}
                    className="block w-full rounded-none rounded-r-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
                  {variant.value.map((item, valueIndex) => (
                    <li
                      key={valueIndex}
                      className="col-span-1 flex rounded-md shadow-sm relative"
                    >
                      {variant.value.length > 1 ? (
                        <TrashIcon
                          aria-hidden="true"
                          className="h-4 w-4 text-gray-400 absolute top-1 right-1 cursor-pointer hover:text-red-500"
                          onClick={() =>
                            deleteVariantValue(variantIndex, valueIndex)
                          }
                        />
                      ) : null}
                      <img
                        alt=""
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${item?.name}&radius=0&fontSize=31`}
                        className="h-18 w-16 object-cover"
                      />
                      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                        <div className="flex-1 truncate px-4 py-4 text-sm">
                          <div className="flex rounded-md w-full">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                              Name
                            </span>
                            <input
                              value={item.name}
                              onChange={(e) => {
                                updateVariantValue(variantIndex, valueIndex, {
                                  ...item,
                                  name: e.target.value,
                                });
                              }}
                              className="block w-full rounded-none rounded-r-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  <button
                    type="button"
                    className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-1 text-center hover:border-gray-400"
                    onClick={() => {
                      addVariantValue(variantIndex, {
                        name: "New Value",
                        inStock: true,
                      });
                    }}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                      className="mx-auto h-8 w-8 text-gray-400"
                    >
                      <path
                        d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mt-1 block text-xs text-gray-900">
                      Add Variant Value
                    </span>
                  </button>
                </ul>
              </div>
            ))}
            <button
              type="button"
              className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 mt-5"
              onClick={() => {
                addNewVariant({
                  name: "New Variant",
                  value: [{ name: "Value 1", inStock: true }],
                });
              }}
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                aria-hidden="true"
                className="mx-auto h-12 w-12 text-gray-400"
              >
                <path
                  d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mt-2 block text-sm font-semibold text-gray-900">
                Add more variants
              </span>
            </button>
            {/* Combinations */}
            {combinations.length > 0 && variants.length > 0 ? (
              <>
                <div className="relative mt-5">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-sm text-gray-500">
                      Variants Combinations
                    </span>
                  </div>
                </div>
                <div className="flow-root overflow-hidden mt-5">
                  <div className="mx-auto max-w-7xl ">
                    <table className="w-full text-left">
                      <thead className="bg-white">
                        <tr>
                          <th
                            scope="col"
                            className="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                          >
                            Name
                            <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                            <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                          </th>
                          <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell"
                          >
                            In-Stock
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {combinations?.map((person, index) => (
                          <tr key={index}>
                            <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                              {person?.name}
                              <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                              <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                              <input
                                onChange={(e) => {
                                  updatePriceCombination(index, e.target.value);
                                }}
                                value={person?.price}
                                placeholder="Variant price"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                              />
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
                              <select
                                onChange={(e) => {
                                  updateStockCombination(index, e.target.value);
                                }}
                                value={person?.inStock}
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                              >
                                <option value={true}>In-Stock</option>
                                <option value={false}>Out of Stock</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Product Information
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                This information will be displayed publicly so be careful what
                you edit.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={addProduct}
                className="block rounded-md bg-themeColor-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-themeColor-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminProductNew;
