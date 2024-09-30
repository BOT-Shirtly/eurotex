import React from "react";

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

const About = () => {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl py-20 sm:px-2 sm:py-30 lg:px-4">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2 mb-20">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                About KingJet Printers
              </h2>
              <p className="mt-4 text-gray-500">
                KingJet Printers Canada is a proud member of a distinguished
                family of companies that has been pioneering in textiles and
                manufacturing since 1945. Our sister company, KingJet
                (Guangzhou) Digital Technology Co., Ltd., boasts 18 years of
                continuous innovation in digital printing technology and is
                recognized globally with the esteemed “KINGJET金捷®” brand.
                <br />
                <br />
                Specializing in the sale of DTF (Direct-to-Film) inks, printing
                supplies, and equipment, we cater to both businesses offering
                DTF printing services and individuals across Canada. As the
                first to pioneer R&D in DTF printing, KingJet remains at the
                forefront of industry trends, dedicating our efforts to the
                production and distribution of high-quality DTF printers, films,
                inks, and related supplies.
                <br />
                <br />
                Our commitment to excellence is reflected not only in our
                products but also in our customer service. We provide
                comprehensive Canadian technical support, offering both on-site
                and online assistance, as well as personalized one-on-one
                technical support. At KingJet Printers Canada, we are more than
                just a supplier—we are a partner dedicated to helping you grow
                your business.
              </p>
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
              {/* <img
                    alt=""
                    src="https://tailwindui.com/img/ecommerce-images/incentives-07-hero.jpg"
                    className="object-cover"
                /> */}
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
                  <img alt="" src={incentive.imageSrc} className="h-16 w-16" />
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
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-1 mb-20">
            <div className="overflow-hidden rounded-lg bg-gray-100 mx-auto">
              {/* <img
                        src="https://kingjetprinter.com/wp-content/uploads/2023/12/13_%E5%88%86%E9%94%80%E7%BD%91%E7%BB%9C_Distribution-network_1200x460.png"
                    /> 
                    <img
                        src="https://kingjetprinter.com/wp-content/uploads/2023/12/14_%E7%89%B9%E8%89%B2%E6%9C%8D%E5%8A%A1_Services_1200x630.png"
                    />  */}
              <img src="https://kingjetprinter.com/wp-content/uploads/2023/12/15_%E5%90%88%E4%BD%9C%E4%BC%99%E4%BC%B4_Partners-reviews_1200x355.png" />
            </div>
          </div>
          {/* <div className="mx-auto max-w-xl lg:max-w-none mb-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                BLAZING A PATH TOWARD A BETTER, SMARTER FUTURE
              </h2>
            </div>
            <div className="mx-auto mt-12 grid max-w-sm grid-cols-1 gap-x-8 gap-y-10 sm:max-w-none lg:grid-cols-3">
              {incentives2.map((incentive) => (
                <div
                  key={incentive.name}
                  className="text-center sm:flex sm:text-left lg:block lg:text-center"
                >
                  <div className="sm:flex-shrink-0">
                    <div className="flow-root">
                      <img
                        alt=""
                        src={incentive.imageSrc}
                        className="mx-auto h-35 w-35"
                      />
                    </div>
                  </div>
                  <div className="mt-3 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
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
          </div> */}
          {/* <div className="mx-auto max-w-xl lg:max-w-none">
            <div className="text-center mb-5">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                KingJet Is On The Way
              </h1>
              <p className="mt-4 text-gray-500 w-3/4 mx-auto">
                About 20 exhibitions & visits to clients around the world
                throughout the year. It’s just one of the many ways that KingJet
                serves the printer industry as an innovator. As a trusted
                partner, we KingJet aim to provide you, our customers become an
                established leader in the inkjet printing industry.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg bg-gray-100">
              <img src="https://kingjetprinter.com/wp-content/uploads/2023/12/%E5%B1%95%E4%BC%9A-%E7%AD%89%E9%AB%98_01.jpg" />
              <img src="https://kingjetprinter.com/wp-content/uploads/2023/12/%E5%B1%95%E4%BC%9A-%E7%AD%89%E9%AB%98_02.jpg" />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default About;
