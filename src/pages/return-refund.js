import React, { useState, useEffect } from "react";
import Loading from "components/loading";
import axios from "axios";

function ReturnRfund() {
  const [isVisible, setIsVisible] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  useEffect(() => {
    setIsVisible(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/eurotex/webpages`, {
        webpage: "Return",
      })
      .then((response) => {
        if (response.data.success == undefined) {
          setIsVisible(false);
          setHtmlContent(response.data[0].description);
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
      <div className="bg-white px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
          <iframe
            title="HTML Preview"
            style={{ width: "100%", height: "60vh", border: "0px" }}
            srcDoc={htmlContent} // Dynamically render the HTML inside the iframe
          ></iframe>
        </div>
      </div>
    </>
  );
}

export default ReturnRfund;
