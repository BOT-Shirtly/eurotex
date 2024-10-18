import React, { useEffect, useState } from "react";
import axios from "axios";

const GoogleTranslate = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [location, setLocation] = useState({ city: "", state: "" });
  const [convert, setConvert] = useState(false);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,fr,es",
          autoDisplay: true,
        },
        "google_translate_element"
      );
    };
    if (convert) {
      window.googleTranslateElementInit = googleTranslateElementInit;
      addGoogleTranslateScript();
    }
  }, [convert]);

  // Function to get user's latitude and longitude
  const getCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (error) => reject(error)
        );
      } else {
        setConvert(true);
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  // Function to get city and state from coordinates
  const getLocationDetails = async (latitude, longitude) => {
    try {
      const apiKey = "ed4362171e5c422e8d78433f293b609a"; // Replace with your OpenCage API key
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
      const response = await axios.get(url);
      const { city, state } = response.data.results[0].components;

      setConvert(true);
      setLocation({ city, state });
    } catch (error) {
      setConvert(true);
      console.error("Error fetching location details:", error);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { latitude, longitude } = await getCoordinates();
        await getLocationDetails(latitude, longitude);
      } catch (error) {
        setConvert(true);
        console.error("Error getting location:", error);
      }
    };
    fetchLocation();
  }, []);

  return <div id="google_translate_element" />;
};

export default GoogleTranslate;
