import React from "react";

const incentives = [
  {
    name: "BigOvenTees",
    imageSrc: "https://bigoventees.netlify.app/static/media/logo.f7aedac0.png",
    link: "https://bigoventees.com/",
    description:
      "BOT NETWORK is a Platform solution for professional decorators. Say goodbye to dealing with customers directly. Now BOT Network generates an additional sales & profit stream and you just focus on decorating quality garments. The BOT network is an easy-to-use platform that grants you access to your network of customers.",
  },
  {
    name: "Twiga",
    link: "https://twigacanada.com/",
    imageSrc:
      "https://twigacanada.com/cdn/shop/files/Twiga-Logos_3c808a17-ee36-4463-bb22-2f3072417ac1_246x150.png?v=1699390518",
    description:
      "The amazing TWIGA history and stellar reputation for “white glove” service goes back more than 38 years ago. For 16 years (1986-2002), our current V.P. Director Technical Services, Alnoor Remtullah, was a Service Manager and Technical VP for Sew Canada Industries, a well-known Tajima distributor in Ontario, Canada. To this day, Alnoor has been involved in assisting the Tajima technical department in many challenges. He has also made valuable suggestions that have been implemented on Tajima machines and the TWIGA service team continues to support Tajima customers.",
  },
  {
    name: "SerTec",
    link: "https://dpidgprinting.com/",
    imageSrc:
      "https://dpidgprinting.com/sites/default/files/evnetwork_it_sertec_logo.jpg",
    description:
      "Leading company in the construction of printing systems on all surfaces",
  },
];

const About = () => {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl py-20 sm:px-2 sm:py-30 lg:px-4">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
          <div>
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                EUROTEX NORTH AMERICA INC.
              </h2>
              <p className="mt-4 text-gray-500">
                Eurotex offers a wide range of products to enhance the
                visibility and versatility of various applications. Whether you
                are looking to add a touch of creativity to uniforms, jackets,
                vests, sportswear, footwear, or accessories, Eurotex has the
                solutions for you.
                <br />
                <br />
                One of the key areas of expertise at Eurotex lies in trims,
                reflective materials, and transfers. These products are designed
                to elevate the aesthetics and functionality of your garments and
                accessories. The extensive selection of trims ensures that you
                can find the perfect embellishments to complement your designs
                and make them stand out. Reflective materials are particularly
                valuable when it comes to safety and visibility. Eurotex offers
                reflective materials that can be integrated into your products,
                enhancing their visibility in low-light conditions. This is
                especially important for applications such as workwear, outdoor
                gear, or any situation where visibility is crucial.
                <br />
                <br />
                Transfers are another specialty of Eurotex. These allow you to
                add intricate designs, logos, or branding elements to your
                textiles with ease. Whether you're looking for a simple transfer
                or a more complex and detailed design, Eurotex can provide you
                with high-quality transfer options.
                <br />
                <br />
                Throughout the years, Eurotex has built a knowledgeable team
                dedicated to assisting customers. Their expertise and commitment
                to customer satisfaction ensure that you will receive the
                support you need when exploring the possibilities offered by
                Eurotex's products. Let your creativity shine through while
                benefiting from the quality and versatility.
              </p>
            </div>
            {/* <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
              
              <iframe
                src="https://www.youtube.com/embed/l6JbWm5DEMQ"
                title="About KingJet Factory"
              ></iframe>
            </div> */}
          </div>
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3 mb-20">
            {incentives.map((incentive) => (
              <div key={incentive.name} className="sm:flex lg:block">
                <div className="sm:flex-shrink-0">
                  <img alt="" src={incentive.imageSrc} className="h-16" />
                </div>
                <div className="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6 h-[20vh]">
                  <h3 className="text-sm font-medium text-gray-900">
                    {incentive.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {incentive.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.open(incentive?.link, "_blank");
                  }}
                  className="mt-5 w-full rounded-md bg-themeColor-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-themeColor-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-500"
                >
                  Visit Site
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-1 mb-20">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 text-center">
              HISTORY
            </h2>
            <div className="overflow-hidden rounded-lg bg-gray-100 mx-auto">
              <img src="https://images.shirtly.com/image/upload/v1727880502/Eurotex/Slides/timeline_yzvnbo.jpg" />
            </div>
            <div className="text-center">
              <a
                type="button"
                href="/contact"
                className="rounded-md bg-themeColor-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-themeColor-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeColor-500"
              >
                CONTACT US
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
