import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111118",
                color: "#f0f0f5",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'DM Sans', sans-serif",
              },
              success: {
                iconTheme: { primary: "#e8c547", secondary: "#0a0a0f" },
              },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
