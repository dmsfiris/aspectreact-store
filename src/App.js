import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "react-use-cart";
import { Toaster } from "react-hot-toast";

import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Product from "./component/Product";
import Cart from "./component/Cart";
import Checkout from "./component/Checkout";
import About from "./component/About";
import Contact from "./component/Contact";
import Exit from "./component/Exit";
import AuthSection from "./component/AuthSection";
import { APP_NAME } from "./lib/config";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50 text-ink">
          <Toaster position="bottom-right" />

          <Navbar />

          <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/exit" element={<Exit />} />
              <Route path="/authSection" element={<AuthSection />} />
            </Routes>
          </main>

          <footer className="border-t border-neutral-200 py-8">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-sm text-neutral-600">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
                <div className="flex gap-4">
                  <a href="/about" className="hover:text-ink">About</a>
                  <a href="/contact" className="hover:text-ink">Contact</a>
                  <a
                    href="https://tailwindcss.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ink"
                  >
                    Built with Tailwind
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
