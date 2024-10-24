import React from "react";

const CloudinaryUploadWidget = (props) => {
  const handleOpenWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "big-oven-tees-inc", // Replace with your Cloudinary cloud name
        uploadPreset: "tnedst8q", // Replace with your upload preset
        sources: ["local", "url", "camera"], // Optional: Specify the sources available for uploading
        cropping: false, // Optional: Enable or disable cropping
        multiple: false, // Optional: Allow multiple file uploads
        folder: props?.folder, // Optional: Specify a folder for the uploaded images
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          if (props?.setProdDataImages) {
            var newValues = { src: result?.info?.secure_url };
            const updatedItems = props?.prodDataImages?.map((item, i) =>
              i === props?.index ? { ...item, ...newValues } : item
            );
            props?.setProdDataImages(updatedItems);
          } else if (props?.setProdData) {
            props?.setProdData({
              ...props?.prodData,
              imageSrc: result?.info?.secure_url,
            });
          } else if (props?.setDetails) {
            const updatedVariants = props?.details.map((variant, index) => {
              if (index === props?.variantIndex) {
                variant.items.push(result?.info?.secure_url);

                return {
                  ...variant,
                  items: variant.items,
                };
              }
              return variant;
            });
            console.log(updatedVariants);
            props?.setDetails(updatedVariants);
          } else if (props?.slides) {
            const updatedData = props?.slides.map((item, i) =>
              i === props?.index
                ? { ...item, [props?.field]: result?.info?.secure_url }
                : item
            );
            props?.setSlides(updatedData); // Update the state with the modified array
          }
        }
      }
    );
    widget.open(); // Open the widget
  };

  return (
    <button
      onClick={handleOpenWidget}
      className="rounded-md w-full bg-themeColor-600 px-2.5 py-1.5 text-white text-sm font-semibold"
    >
      Upload File&nbsp;<span aria-hidden="true">&rarr;</span>
    </button>
  );
};

export default CloudinaryUploadWidget;
