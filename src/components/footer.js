import React, { useState, useEffect } from "react";
import Loading from "components/loading";
import axios from "axios";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [navigation, setNavigation] = useState([]);
  const [editorValue, setEditorValue] = useState("");
  useEffect(() => {
    setIsVisible(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/eurotex/webpages`, {
        webpage: "Footer",
      })
      .then((response) => {
        if (response.data.success == undefined) {
          setIsVisible(false);
          setNavigation(response.data);
          setEditorValue(
            response.data.filter((section) => section.name === "Description")[0]
              ?.description
          );
        } else {
          setIsVisible(false);
        }
      })
      .catch((error) => {
        setIsVisible(false);
      });
  }, []);
  return (
    <>
      {isVisible && <Loading />}
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
              <div
                dangerouslySetInnerHTML={{ __html: editorValue }}
                className="space-y-6 text-base text-gray-300"
              />
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-8 text-left">
                {navigation?.map((item, i) =>
                  item?.items ? (
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
                        {item?.items?.map((page, j) => (
                          <li key={j}>
                            <a
                              href={page?.href}
                              className="text-sm leading-6 text-gray-300 hover:text-white"
                            >
                              {page?.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null
                )}
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
    </>
  );
}

export default Footer;
