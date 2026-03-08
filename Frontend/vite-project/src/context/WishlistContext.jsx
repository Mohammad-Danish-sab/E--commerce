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

  const addToWishlist = (p) =>
    setWishlist((prev) =>
      prev.find((x) => x._id === p._id) ? prev : [...prev, p],
    );
  const removeFromWishlist = (id) =>
    setWishlist((prev) => prev.filter((p) => p._id !== id));
  const isWishlisted = (id) => wishlist.some((p) => p._id === id);
  const toggleWishlist = (p) =>
    isWishlisted(p._id) ? removeFromWishlist(p._id) : addToWishlist(p);

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
