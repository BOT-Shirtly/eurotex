import React, { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import Loading from "../components/loading";
import { ToastContainer, toast } from "react-toastify";

const jobOpenings = [
  {
    id: 1,
    role: "Printers",
    description:
      "Our printers embody cutting-edge industry technology, delivering products with exceptional stability, robust durability, and an extended service life.",
  },
  {
    id: 2,
    role: "Printing Consumable and Supplies",
    description:
      "Leveraging a strong and reliable supply chain, we offer high-quality printing consumables at highly competitive prices, ensuring excellent value for our customers.",
  },
  {
    id: 3,
    role: "Tech Support And Traning",
    description:
      "We provide comprehensive technical consultations, responsive after-sales support, and expert training programs designed to empower your business growth.",
  },
  {
    id: 4,
    role: "Brand",
    description:
      "The KingJet brand is globally recognized, bringing with it a reputation that attracts potential customers and opens doors to new business opportunities.",
  },
];

const features = [
  {
    name: "Technical Advantages",
    description:
      "Our printing equipment incorporates advanced technology, offering features such as ultra-high resolution, precise color reproduction, and high-speed printing to meet the most demanding printing requirements.",
    href: "#",
    icon: ArrowPathIcon,
  },
  {
    name: "Versatility",
    description:
      "Our printing equipment supports printing on various materials, compatible with different ink/dye types. It also offers multiple printing modes and size options to fulfill the comprehensive needs of various industries.",
    href: "#",
    icon: ArrowPathIcon,
  },
  {
    name: "Energy Efficiency",
    description:
      "Our printing equipment is designed with energy-saving and environmentally friendly features. Through advanced technology and sustainable development design, we provide customers with efficient and eco-friendly printing solutions.",
    href: "#",
    icon: ArrowPathIcon,
  },
  {
    name: "User-Friendliness",
    description:
      "Our printing equipment is easy to operate with a user-friendly interface. Automated functions reduce training costs and user errors, providing an excellent user experience.",
    href: "#",
    icon: ArrowPathIcon,
  },
  {
    name: "Security",
    description:
      "Our printing equipment has robust security features, including data encryption, identity authentication, and remote monitoring, ensuring customer information security and device reliability.",
    href: "#",
    icon: ArrowPathIcon,
  },
  {
    name: "Scalability",
    description:
      "Our printing equipment supports flexible accessory and component upgrades, such as paper feeding systems and ink systems, to meet the ever-changing business needs of our customers, laying the foundation for long-term cooperation.",
    href: "#",
    icon: ArrowPathIcon,
  },
];

const stats = [
  {
    id: 1,
    name: "24-Hour Customer Service Online provided by experts",
    value: "24-Hour",
  },
  {
    id: 2,
    name: "1 VS 1 Bilingual Technician Service provided by experts",
    value: "1 vs. 1",
  },
  {
    id: 3,
    name: "Overseas Offices Provide Localization Services",
    value: "Overseas",
  },
  { id: 4, name: "Lifetime service & one year warranty", value: "Warranty" },
];

const incentives = [
  {
    name: "Unwavering Quality",
    imageSrc:
      "https://tailwindui.com/img/ecommerce/icons/icon-exchange-simple.svg",
    description:
      "With 18 years of expertise in printer design and R&D, KingJet is committed to excellence through advanced production technologies and rigorous quality control processes. Our printers integrate cutting-edge industry innovations, offering unparalleled stability, exceptional durability, and an extended service life.",
  },
  {
    name: "Service & Support",
    imageSrc:
      "https://tailwindui.com/img/ecommerce/icons/icon-shipping-simple.svg",
    description:
      "KingJet strives to provide prompt responses to customer needs, addressing inquiries and requests in a timely manner. Our technical support team, with its deep industry knowledge and experience, is dedicated to providing precise guidance and effective solutions.",
  },
  {
    name: "Consumables and Supplies",
    imageSrc:
      "https://tailwindui.com/img/ecommerce/icons/icon-warranty-simple.svg",
    description:
      "Backed by a robust and dependable supply chain, we deliver high-quality printing consumables at highly competitive prices, offering our customers exceptional value and seamless production.",
  },
];

const faqs = [
  {
    question: "What Sets KingJet's DTF Printers Apart from Other Brands?",
    answer:
      "KingJet stands out as one of the pioneers in the DTF printing industry, backed by 18 years of experience in digital printing technology. Our printers are built with a robust design, ensuring greater stability during operation compared to other brands. One key feature of our machines is the use of the BYHX board, which is the optimal match for Epson printheads. This advanced technology enhances printing stability, giving you peace of mind. Additionally, our DTF printers are equipped with a white ink circulation system, significantly reducing the risk of printhead clogging and lowering maintenance costs. Most importantly, with 15 years of manufacturing expertise, we offer not only high-quality DTF printers but also the flexibility to customize machines according to your needs. We provide distributors with competitively priced DTF machines tailored to their specific ideas and requirements.",
  },
  {
    question:
      "Does the Machine Require Daily Cleaning and Maintenance? Is Daily Maintenance Difficult?",
    answer:
      "We recommend using the machine daily to ensure optimal performance. As for maintenance, we provide detailed maintenance instructions and dedicated technical support to assist you. The maintenance process is simple and convenient.",
  },
  {
    question:
      "Does The Machine Require Daily Cleaning And Maintenance? Is Daily Maintenance Difficult?",
    answer:
      "It is recommended to use the machine for printing every day. Regarding the maintenance of the machine, we will provide a detailed maintenance manual, and there will also be specialized technology to assist you. The maintenance of the machine is very simple and convenient. If you need it, we can send maintenance manual before you buy it for your advance reference.",
  },
  {
    question: "What Kind Of Technical Support Is Provided?",
    answer:
      "We offer personalized, one-on-one technical support and after-sales service. Whether you need assistance with machine installation or encounter issues during printing, our team is here to guide you through the process and provide timely, professional solutions.",
  },
  {
    question: "How Long Is The Warranty Period?",
    answer:
      "We offer a 3-year warranty with annual tune-ups included for the entire period!. *Please note that the warranty excludes printheads and normal wear and tear on consumable parts. For more details, feel free to contact our customer service team.",
  },
  {
    question:
      "Can I Use Other Brands Of Ink And Supplies When I Run Out? Do I Have To Buy Ink From You?",
    answer:
      "If the ink and consumables run out, in principle, you can use other brands and buy them locally. However, it is recommended to buy from us or our dealers, because different ink icc configurations are not the same. If you want to achieve the same results at the beginning, it is recommended to use our brand ink.",
  },
  {
    question: "What Are The Payment Methods?",
    answer: "We currently accept all major credit cards through Stripe.",
  },
  {
    question: "Is The Voltage Selectable?",
    answer:
      "Yes, the KingJet DTF printer is compatible with single-phase power. Simply inform us of your local single-phase voltage and plug standard, and we will customize the machine to meet your specifications. Both 110V and 220V options are available for select printers and dryer units at the time of ordering.",
  },
];

const slides = [
  {
    url: "https://images.shirtly.com/image/upload/v1727709069/Eurotex/Slides/HEADER_LOGO_iukhjq.webp",
    alt: "Eurotex North America Inc.",
    href: "/contact",
  },
  {
    url: "https://images.shirtly.com/image/upload/v1727709069/Eurotex/Slides/HEADER_LOGO_iukhjq.webp",
    alt: "Eurotex North America Inc.",
    href: "/contact",
  },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [slides, setSlides] = useState([]);
  useEffect(() => {
    setIsVisible(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/eurotex/webpages`, {
        webpage: "HomePage",
      })
      .then((response) => {
        if (response.data.success == undefined) {
          setIsVisible(false);
          if (response.data[0].slides.length == 1) {
            response?.data[0]?.slides.push(response?.data[0]?.slides[0]);
          }
          setSlides(response?.data[0]?.slides);
        } else {
          setIsVisible(false);
        }
      })
      .catch((error) => {
        setIsVisible(false);
      });
  }, []);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 10000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    setIsVisible(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/eurotex/products/all`)
      .then((response) => {
        if (response.data.success == undefined) {
          setIsVisible(false);

          if (response.data.length > 4) {
            response.data.splice(4);
          }
          setFavorites(response.data);
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
        <header className="relative overflow-hidden">
          {/* Hero section */}
          <div className="bg-gray-100 flex items-center justify-center">
            <div className="relative w-full mx-auto">
              <div className="carousel-inner overflow-hidden block">
                <div className="relative mx-auto w-full">
                  {/* Decorative image grid */}
                  <div aria-hidden="true" className="pointer-events-none">
                    <div className="w-full overflow-hidden sm:opacity-0 lg:opacity-100">
                      <a href={slides[currentIndex]?.href}>
                        <img
                          src={slides[currentIndex]?.imageSrc}
                          className="h-[50vh] w-full object-contain object-center"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={goToPrevious}
                className="absolute top-1/2 h-full left-0 transform -translate-y-1/2 bg-gray-0 text-black px-4 py-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute top-1/2 h-full right-0 transform -translate-y-1/2 bg-gray-0 text-black px-4 py-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main>
          {/* Favorites section */}
          <section aria-labelledby="favorites-heading">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-32 lg:px-8">
              <div className="sm:flex sm:items-baseline sm:justify-between mb-5">
                <h2
                  id="favorites-heading"
                  className="text-2xl font-bold tracking-tight text-gray-900"
                >
                  Main Products
                </h2>
                <a
                  href="/products"
                  className="hidden text-sm font-semibold text-themeColor-600 hover:text-themeColor-500 sm:block"
                >
                  Browse all products
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>

              <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
                {favorites?.map((favorite, i) => (
                  <div
                    key={i}
                    className="group relative border-t border-b border-r border-gray-200"
                  >
                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg group-hover:opacity-75">
                      <img
                        alt={favorite.imageAlt}
                        src={favorite.imageSrc}
                        className="h-full w-full object-contain object-center"
                      />
                    </div>
                    <div className="pb-4 pt-4 text-center">
                      <h3 className="text-xl font-medium text-gray-900">
                        <a href={favorite.href}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {favorite.name}
                        </a>
                      </h3>
                      <p className="mt-4 text-base font-small text-gray-900">
                        {isNaN(favorite?.price)
                          ? favorite?.price
                          : `$${favorite?.price}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features section */}
          {/* <section aria-labelledby="cause-heading">
            <div className="relative bg-black px-6 py-12 sm:px-12 sm:py-20 lg:px-16">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                  <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    KingJet Printers Features
                  </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                  <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                    {features.map((feature) => (
                      <div key={feature.name} className="flex flex-col">
                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                          <feature.icon
                            aria-hidden="true"
                            className="h-5 w-5 flex-none text-white-400"
                          />
                          {feature.name}
                        </dt>
                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                          <p className="flex-auto">{feature.description}</p>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </section> */}

          {/* Printing Solutions section */}
          {/* <section aria-labelledby="cause-heading">
            <div className="bg-white pb-20 mt-20">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  KingJet's Printing Solution
                </h2>
                <p className="mt-6 mb-6 text-small leading-8 text-gray-600">
                  KingJet’s commitment to market research and cutting-edge
                  product development ensures that we remain at the forefront of
                  industry innovation. By staying attuned to evolving trends, we
                  consistently deliver printers that not only exceed the
                  expectations of end-users but also empower our agents with
                  competitive profit margins, efficient operations, and
                  exceptional professional services and technical support.
                </p>
                <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-16 lg:mx-0 lg:max-w-none lg:flex-row">
                  <div className="w-full lg:flex-auto">
                    <img
                      alt=""
                      src="https://kingjetprinter.com/wp-content/uploads/elementor/thumbs/-e1702106460510-qgjpp2nz4vhxgncxgv1ktmdjslu2nrzpoixcn7xoya.jpg"
                      className="w-full rounded-2xl bg-gray-50 object-contain lg:aspect-auto"
                    />
                  </div>
                  <div className="w-full lg:max-w-xl lg:flex-auto">
                    <ul className="-my-8 divide-y divide-gray-100">
                      {jobOpenings.map((opening) => (
                        <li key={opening.id} className="py-8">
                          <dl className="relative flex flex-wrap gap-x-3">
                            <dt className="sr-only">Role</dt>
                            <dd className="w-full flex-none text-lg font-semibold tracking-tight text-gray-900">
                              <a href={opening.href}>
                                {opening.role}
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0"
                                />
                              </a>
                            </dd>
                            <dt className="sr-only">Description</dt>
                            <dd className="mt-2 w-full flex-none text-base leading-7 text-gray-600">
                              {opening.description}
                            </dd>
                          </dl>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          {/* Service section */}
          {/* <section aria-labelledby="cause-heading">
            <div className="bg-gray-900 py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      Professional Technicians Service
                    </h2>
                  </div>
                  <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.id}
                        className="flex flex-col bg-white/5 p-8"
                      >
                        <dt className="text-sm font-semibold leading-6 text-gray-300">
                          {stat.name}
                        </dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </section> */}

          {/* About section */}
          {/* <section aria-labelledby="cause-heading">
            <div className="pt-24 sm:pt-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2 mb-20">
                  <div>
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                      About KingJet Printers
                    </h2>
                    <p className="mt-4 text-gray-500">
                      KingJet Printers Canada is a proud member of a
                      distinguished family of companies that has been pioneering
                      in textiles and manufacturing since 1945. Our sister
                      company, KingJet (Guangzhou) Digital Technology Co., Ltd.,
                      boasts 18 years of continuous innovation in digital
                      printing technology and is recognized globally with the
                      esteemed “KINGJET金捷®” brand.
                      <br />
                      <br />
                      Specializing in the sale of DTF (Direct-to-Film) inks,
                      printing supplies, and equipment, we cater to both
                      businesses offering DTF printing services and individuals
                      across Canada. As the first to pioneer R&D in DTF
                      printing, KingJet remains at the forefront of industry
                      trends, dedicating our efforts to the production and
                      distribution of high-quality DTF printers, films, inks,
                      and related supplies.
                      <br />
                      <br />
                      Our commitment to excellence is reflected not only in our
                      products but also in our customer service. We provide
                      comprehensive Canadian technical support, offering both
                      on-site and online assistance, as well as personalized
                      one-on-one technical support. At KingJet Printers Canada,
                      we are more than just a supplier—we are a partner
                      dedicated to helping you grow your business.
                    </p>
                  </div>
                  <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
                    <iframe
                      src="https://www.youtube.com/embed/l6JbWm5DEMQ"
                      title="About KingJet Factory"
                    ></iframe>
                  </div>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3 mb-20">
                  {incentives.map((incentive) => (
                    <div key={incentive.name} className="sm:flex lg:block">
                      <div className="sm:flex-shrink-0">
                        <img
                          alt=""
                          src={incentive.imageSrc}
                          className="h-16 w-16"
                        />
                      </div>
                      <div className="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
                        <h3 className="text-sm font-medium text-gray-900">
                          {incentive.name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          {incentive.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section> */}

          {/* FAQ section */}
          {/* <section aria-labelledby="cause-heading ">
            <div className="bg-black border-b border-gray-500">
              <div className="mx-auto max-w-7xl px-6 py-20 sm:py-20 lg:px-8 lg:py-20">
                <div className="mx-auto divide-y divide-white/10">
                  <h2 className="text-2xl font-bold leading-10 tracking-tight text-white">
                    Frequently asked questions
                  </h2>

                  <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 mb-20">
                    {faqs.map((faq) => (
                      <Disclosure key={faq.question} as="div" className="pt-6">
                        <dt>
                          <DisclosureButton className="group flex w-full items-start justify-between text-left text-white">
                            <span className="text-base font-semibold leading-7">
                              {faq.question}
                            </span>
                            <span className="ml-6 flex h-7 items-center">
                              <PlusSmallIcon
                                aria-hidden="true"
                                className="h-6 w-6 group-data-[open]:hidden"
                              />
                              <MinusSmallIcon
                                aria-hidden="true"
                                className="h-6 w-6 [.group:not([data-open])_&]:hidden"
                              />
                            </span>
                          </DisclosureButton>
                        </dt>
                        <DisclosurePanel as="dd" className="mt-2 pr-12">
                          <p className="text-base leading-7 text-gray-300">
                            {faq.answer}
                          </p>
                        </DisclosurePanel>
                      </Disclosure>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section> */}
        </main>
      </div>
    </>
  );
};

export default Home;
