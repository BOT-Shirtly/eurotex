import React, { useState, useEffect } from "react";
import Loading from "components/loading";
import axios from "axios";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [incentives, setIncentives] = useState([]);
  const [editorValue, setEditorValue] = useState("");
  useEffect(() => {
    setIsVisible(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/eurotex/webpages`, {
        webpage: "About",
      })
      .then((response) => {
        if (response.data.success == undefined) {
          setIsVisible(false);
          setEditorValue(response.data[0].description);
          setIncentives(response.data[0].incentives);
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
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl py-20 sm:px-2 sm:py-30 lg:px-4">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
            <div>
              <div dangerouslySetInnerHTML={{ __html: editorValue }} />

              {/* <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
              
              <iframe
                src="https://www.youtube.com/embed/l6JbWm5DEMQ"
                title="About KingJet Factory"
              ></iframe>
            </div> */}
            </div>
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3 mb-20">
              {incentives.map((incentive) => (
                <div key={incentive.title} className="sm:flex lg:block">
                  <div className="sm:flex-shrink-0">
                    <img alt="" src={incentive.imageSrc} className="h-16" />
                  </div>
                  <div className="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6 h-[20vh]">
                    <h3 className="text-sm font-medium text-gray-900">
                      {incentive.title}
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
    </>
  );
};

export default About;
