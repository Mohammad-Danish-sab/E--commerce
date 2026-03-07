import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) =>
    setWishlist((prev) =>
      prev.find((p) => p._id === product._id) ? prev : [...prev, product],
    );
  const removeFromWishlist = (id) =>
    setWishlist((prev) => prev.filter((p) => p._id !== id));
  const isWishlisted = (id) => wishlist.some((p) => p._id === id);
  const toggleWishlist = (product) =>
    isWishlisted(product._id)
      ? removeFromWishlist(product._id)
      : addToWishlist(product);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
