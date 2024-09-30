import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
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

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Header />
          <main className="pt-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
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
