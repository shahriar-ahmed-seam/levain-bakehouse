import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Story from "./components/Story";
import Reviews from "./components/Reviews";
import OrderForm from "./components/OrderForm";
import Footer from "./components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Products />
        <Story />
        <Reviews />
        <OrderForm />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </div>
    </CartProvider>
  );
}

export default App;
