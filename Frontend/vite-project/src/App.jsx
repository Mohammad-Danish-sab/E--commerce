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


import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import AddProduct from "./admin/pages/AddProduct";
import Orders from "./admin/pages/Orders";
import Users from "./admin/pages/Users";
import Reviews from "./admin/pages/Reviews";
import Categories from "./admin/pages/Categories";
import Coupons from "./admin/pages/Coupons";
import Settings from "./admin/pages/Settings";

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

        <Route path="/admin" element={<Dashboard />} />

        <Route path="/admin/products" element={<Products />} />

        <Route path="/admin/add-product" element={<AddProduct />} />

        <Route path="/admin/orders" element={<Orders />} />

        <Route path="/admin/users" element={<Users />} />

        <Route path="/admin/reviews" element={<Reviews />} />

        <Route path="/admin/categories" element={<Categories />} />

        <Route path="/admin/coupons" element={<Coupons />} />

        <Route path="/admin/settings" element={<Settings />} />

        
      </Routes>
      <BackToTop />
      <LiveChat />
    </>
  );
}

export default App;
