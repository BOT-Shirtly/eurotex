import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Products from "./pages/products";
import Product from "./pages/product";
import Cart from "./pages/cart";
import Summary from "./pages/summary";
import SignIn from "./pages/signin";
import Checkout from "./pages/checkout";
import Signup from "./pages/signup";
import Header from "./components/header";
import Footer from "./components/footer";
import Orders from "./pages/orders";
import Admin from "./pages/admin";
import PrivacyPolicy from "./pages/privacy-policy";
import Service from "pages/service";
import Terms from "pages/terms";
import ReturnRfund from "pages/return-refund";
import Shipping from "pages/shipping";
import Loading from "./components/loading";

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [location, setLocation] = useState({ city: "", state: "" });

  // Function to get user's latitude and longitude
  const getCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (error) => reject(error)
        );
      } else {
        setIsVisible(false);
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
      setLocation({ city, state });
      setIsVisible(false);
    } catch (error) {
      setIsVisible(false);
      console.error("Error fetching location details:", error);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsVisible(true);
        const { latitude, longitude } = await getCoordinates();
        await getLocationDetails(latitude, longitude);
      } catch (error) {
        setIsVisible(false);
        console.error("Error getting location:", error);
      }
    };
    fetchLocation();
  }, []);

  return (
    <div className="App">
      {isVisible && <Loading />}
      <Router>
        <div>
          <Header />
          <main className="pt-32">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/service" element={<Service />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/return-refund" element={<ReturnRfund />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:productId" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
