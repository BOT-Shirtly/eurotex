const navigation = [
  {
    name: "About",
    items: [
      { name: "Contact Us", href: "/contact" },
      {
        name: "Ontario Office: 122 Middleton Street, Brantford ON N3S7V7 Canada",
        href: "https://www.google.com/maps/place/122+Middleton+St,+Brantford,+ON+N3S+7V7/@43.1624998,-80.2291992,17z/data=!3m1!4b1!4m6!3m5!1s0x882c644a1d829d8d:0xae4f1d514781029d!8m2!3d43.1624959!4d-80.2266243!16s%2Fg%2F11gk4pcch2?entry=ttu&g_ep=EgoyMDI0MDgyNy4wIKXMDSoASAFQAw%3D%3D",
      },
      // {
      //   name: "Québec Office: 4240 Rue Seré, Montréal QC H4T 1A6 Canada",
      //   href: "https://www.google.com/maps/place/4240+Ser%C3%A9+St,+Montreal,+QC+H4T+1A6/@45.4854137,-73.7106909,16z/data=!3m1!4b1!4m6!3m5!1s0x4cc917efac31203f:0xd7bdcc2f8f98ea60!8m2!3d45.48541!4d-73.70582!16s%2Fg%2F11c2f5zpdr?entry=ttu&g_ep=EgoyMDI0MDgyNy4wIKXMDSoASAFQAw%3D%3D",
      // },
      {
        name: "Email: info@eurotex.com",
        href: "mailto:info@eurotex.com",
      },
    ],
  },
  {
    name: "Category",
    items: [
      { name: "DTF Printer", href: "/products" },
      { name: "DTF Inks", href: "/products" },
      { name: "DTF Films", href: "/products" },
      { name: "DTF Powder", href: "/products" },
    ],
  },
  {
    name: "Resources",
    items: [
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Shipping", href: "/shipping" },
      { name: "Return & Refund", href: "/return-refund" },
    ],
  },
];

function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="bg-black">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <img
              alt="Eurotex"
              src="https://images.shirtly.com/image/upload/v1727708999/Eurotex/Logos/EUROTEX_2024_LOGO_ENG_WHITE_grb3r0.png"
              className="w-full"
            />
            <p className="text-sm leading-6 text-gray-300">
              Since 1945, EuroTex Inc has been a key player in textiles and
              manufacturing. Partnering with KingJet (Guangzhou) Digital
              Technology Co., Ltd., renowned for 18 years of innovation in
              digital printing, we proudly represent the global “KINGJET金捷®”
              brand.
              <br />
              <br />
              We specialize in DTF (Direct-to-Film) inks, supplies, and
              equipment, serving businesses and individuals across Canada. As
              pioneers in DTF R&D, we lead the industry with high-quality
              printers, films, inks, and top-notch customer service. At Eurotex
              Canada, we’re not just suppliers—we’re your dedicated partner in
              business growth, offering expert Canadian technical support and
              personalized assistance.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-8 text-left">
              {navigation.map((item, i) => (
                <div key={i} className="mb-10">
                  <h3 className="text-sm font-semibold leading-6 text-white mb-3">
                    {item.name}
                  </h3>
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center"
                    >
                      <div className="w-full border-t border-gray-300" />
                    </div>
                  </div>
                  <ul role="list" className="mt-6 space-y-4">
                    {item.items.map((page, j) => (
                      <li key={j}>
                        <a
                          href={page.href}
                          className="text-sm leading-6 text-gray-300 hover:text-white"
                        >
                          {page.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; 2024 Eurotex Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
