"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Radio,
  RadioGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  StarIcon,
  CheckCircleIcon,
  CloudArrowDownIcon,
} from "@heroicons/react/20/solid";
import Loading from "../components/loading";
import { ToastContainer, toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Product() {
  const [isVisible, setIsVisible] = useState(false);
  const { productId } = useParams();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [combinations, setCombinations] = useState([]);

  const handleRadioChange = (category, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  useEffect(() => {
    const findSku = combinations.find(
      (item) => item.name === Object.values(selectedVariants).join(" | ")
    );
    setProduct({
      ...product,
      price: findSku?.price,
      inStock: findSku?.inStock,
      orderedCombination: {
        ...findSku,
        qty: product?.orderedCombination?.qty
          ? Number(product?.orderedCombination?.qty)
          : 1,
      },
    });
  }, [selectedVariants]);

  useEffect(() => {
    setIsVisible(true);
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/kingjetprinters/product?id=${productId}`
      )
      .then((response) => {
        if (response.data.success == undefined) {
          setProduct(response?.data[0]);
          setImages([
            {
              id: 0,
              type: "image",
              name: response?.data[0]?.name,
              src: response?.data[0]?.imageSrc,
              alt: response?.data[0]?.imageAlt,
            },
            ...response?.data[0]?.images,
          ]);
          setProductVariants(response?.data[0]?.variants);

          const result = response?.data[0]?.variants.reduce((acc, variant) => {
            acc[variant.name] = variant.value[0].name;
            return acc;
          }, {});
          setSelectedVariants(result);
          setCombinations(response?.data[0]?.combinations);
          const findSku = response?.data[0]?.combinations.find(
            (item) => item.name === Object.values(result).join(" | ")
          );
          findSku.qty = 1;
          setProduct({
            ...response?.data[0],
            price: findSku?.price,
            inStock: findSku?.inStock,
            orderedCombination: findSku,
          });

          // Related Products
          axios
            .get(
              `${process.env.REACT_APP_BASE_URL}/kingjetprinters/products/all`
            )
            .then((response1) => {
              if (response1.data.success == undefined) {
                setIsVisible(false);
                setRelatedProducts(response1.data);
              } else {
                toast.error(response1.data.message, {
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
        toast.error("Error, please try agian later!!", {
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
    var userData = localStorage.getItem("__KingJetUser__");
    if (userData) {
      setUserDetails(JSON.parse(userData));
    } else {
      setUserDetails({});
    }
  }, []);

  const addToBag = () => {
    setIsVisible(true);
    product.orderedVariant = selectedVariants;
    delete product._id;
    const userData = JSON.parse(localStorage.getItem("__KingJetUser__"));
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/kingjetprinters/cart`, product, {
        headers: {
          authorization: userData?.authToken, // Replace with your token
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast.success("Added to Bag.", {
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
          setTimeout(() => {
            window.location.reload();
          }, 1000);
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
          localStorage.removeItem("__KingJetUser__");
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
        localStorage.removeItem("__KingJetUser__");
        window.location.replace("/");
      });
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
        <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            {/* Product */}
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              {/* Image gallery */}
              <TabGroup className="flex flex-col-reverse">
                {/* Image selector */}
                <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
                  <TabList className="grid grid-cols-4 gap-6">
                    {images?.map((image) => (
                      <Tab
                        key={image?.id}
                        className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-0 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                      >
                        <span className="sr-only">{image?.name}</span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img
                            alt=""
                            src={image?.src}
                            className="h-full w-full object-contain object-center"
                          />{" "}
                          :
                        </span>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-themeColor-500"
                        />
                      </Tab>
                    ))}
                  </TabList>
                </div>

                <TabPanels className="aspect-h-1 aspect-w-1 w-full">
                  {images?.map((image) => (
                    <TabPanel key={image?.id}>
                      {image?.type == "image" ? (
                        <img
                          alt={image?.alt}
                          src={image?.src}
                          className="h-full w-full object-contain object-center sm:rounded-lg"
                        />
                      ) : (
                        <iframe
                          src={image?.link}
                          title="About KingJet Factory"
                          className="w-full h-full object-contain object-center sm:rounded-lg"
                        ></iframe>
                      )}
                    </TabPanel>
                  ))}
                </TabPanels>
              </TabGroup>

              {/* Product info */}
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {product?.name}
                </h1>

                <div className="mt-3">
                  <p className="text-3xl tracking-tight text-gray-900">
                    {isNaN(product?.price)
                      ? product?.price
                      : `$${product?.price}`}
                  </p>
                </div>
                <div className="relative mt-5">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-base font-semibold leading-6 text-gray-900">
                      Description
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <div
                    dangerouslySetInnerHTML={{ __html: product?.description }}
                    className="space-y-6 text-base text-gray-700"
                  />
                </div>
                <div className="relative mt-5">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-base font-semibold leading-6 text-gray-900">
                      Variants
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  {productVariants.map((variant, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="text-lg font-semibold">
                        {variant.name}: {selectedVariants[variant.name]}
                      </h3>
                      <div className="space-y-5">
                        {variant.value.map((option, idx) => (
                          <label
                            key={idx}
                            className="inline-flex items-center mr-4 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={variant.name}
                              value={option.name}
                              checked={
                                selectedVariants[variant.name] === option.name
                              }
                              onChange={() =>
                                handleRadioChange(variant.name, option.name)
                              }
                              className="form-radio text-themeColor-600"
                            />
                            <span className="ml-2">{option.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  {product?.inStock ? (
                    <div>
                      <label
                        htmlFor="qty"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Quantity
                      </label>
                      <div className="mt-2">
                        <input
                          id="qty"
                          name="qty"
                          type="number"
                          value={product?.orderedCombination?.qty}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              product.orderedCombination.qty = Number(
                                e.target.value
                              );
                              setProduct({
                                ...product,
                                orderedCombination: product.orderedCombination,
                              });
                            }
                          }}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-themeColor-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-10 flex">
                    {isNaN(product?.price) ? (
                      <a
                        href="/contact"
                        type="submit"
                        className="flex flex-1 w-full items-center justify-center rounded-md border border-transparent bg-themeColor-600 px-8 py-3 text-base font-medium text-white hover:bg-themeColor-700 focus:outline-none focus:ring-2 focus:ring-themeColor-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                      >
                        Contact
                      </a>
                    ) : product?.inStock ? (
                      product?.orderedCombination?.qty ? (
                        userDetails?.authToken ? (
                          <button
                            onClick={addToBag}
                            type="submit"
                            className="flex flex-1 w-full items-center justify-center rounded-md border border-transparent bg-themeColor-600 px-8 py-3 text-base font-medium text-white hover:bg-themeColor-700 focus:outline-none focus:ring-2 focus:ring-themeColor-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                          >
                            Add to bag : $
                            {Number(
                              Number(product?.orderedCombination?.qty) *
                                Number(product?.price)
                            ).toFixed(2)}
                          </button>
                        ) : (
                          <a
                            href="/signin"
                            className="flex flex-1 w-full items-center justify-center rounded-md border border-transparent bg-themeColor-600 px-8 py-3 text-base font-medium text-white hover:bg-themeColor-700 focus:outline-none focus:ring-2 focus:ring-themeColor-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                          >
                            Sign In - To add to cart
                          </a>
                        )
                      ) : (
                        <button
                          type="submit"
                          className="flex flex-1 w-full items-center justify-center rounded-md border border-transparent bg-gray-600 px-8 py-3 text-base font-medium text-white sm:w-full"
                        >
                          Enter Quantity
                        </button>
                      )
                    ) : (
                      <div className="flex flex-1 w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-themeColor-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative mt-5">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-base font-semibold leading-6 text-gray-900">
                      Product Information
                    </span>
                  </div>
                </div>
                <section aria-labelledby="details-heading" className="mt-5">
                  <div className="">
                    {product?.details?.map((detail) => (
                      <Disclosure key={detail?.name} as="div" defaultOpen>
                        <h3>
                          <DisclosureButton
                            className="group relative flex w-full items-center justify-between py-6 text-left"
                            defaultOpen={true}
                          >
                            <span className="text-sm font-medium text-gray-900 group-data-[open]:text-themeColor-600">
                              {detail?.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon
                                aria-hidden="true"
                                className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                              />
                              <MinusIcon
                                aria-hidden="true"
                                className="hidden h-6 w-6 text-themeColor-400 group-hover:text-themeColor-500 group-data-[open]:block"
                              />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="prose prose-sm pb-6">
                          <ul role="list" className="divide-y divide-gray-100">
                            {detail?.items?.map((item, index) => (
                              <li key={index}>
                                {item.indexOf("http") >= 0 ? (
                                  <a
                                    className="flex gap-x-2 py-3"
                                    href={item?.split(" | ")[1]}
                                    target="_blank"
                                  >
                                    <CloudArrowDownIcon className="h-55 w-5 text-themeColor-600" />
                                    <div className="flex-auto">
                                      <p className="line-clamp-2 text-sm text-gray-600 underline">
                                        {item?.split(" | ")[0]}
                                      </p>
                                    </div>
                                  </a>
                                ) : (
                                  <div className="flex gap-x-2 py-3">
                                    <CheckCircleIcon className="h-5 w-5 text-themeColor-600" />
                                    <div className="flex-auto">
                                      <p className="line-clamp-2 text-sm text-gray-600">
                                        {item}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </DisclosurePanel>
                      </Disclosure>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <section
              aria-labelledby="related-heading"
              className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
            >
              <h2
                id="related-heading"
                className="text-xl font-bold text-gray-900"
              >
                Customers also bought
              </h2>

              <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                {relatedProducts?.map((product) => (
                  <div key={product?.id}>
                    <div className="relative">
                      <div className="relative h-72 w-full overflow-hidden rounded-lg">
                        <img
                          alt={product?.imageAlt}
                          src={product?.imageSrc}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="relative mt-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {product?.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {product?.color}
                        </p>
                      </div>
                      <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                        />
                        {isNaN(product?.price) ? null : (
                          <p className="relative text-lg font-semibold text-white">
                            ${product?.price}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6">
                      <a
                        href={product?.href}
                        className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default Product;
