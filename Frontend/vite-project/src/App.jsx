import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LiveChat from "./components/LiveChat";
import BackToTop from "./components/BackToTop";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";
import OrderTracking from "./pages/OrderTracking";
import Notifications from "./pages/Notifications";
import CompareProducts from "./pages/CompareProducts";
import GiftCards from "./pages/GiftCards";
import FeaturedProducts from "./pages/FeaturedProducts";
import About from "./pages/About";
import FlashSale from "./pages/FlashSale";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/featured" element={<FeaturedProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id/track" element={<OrderTracking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/compare" element={<CompareProducts />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/about" element={<About />} />
        <Route path="/flash-sale" element={<FlashSale />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BackToTop />
      <LiveChat />
    </>
  );
}

export default App;
