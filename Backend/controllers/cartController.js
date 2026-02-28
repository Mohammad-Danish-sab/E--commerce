import Cart from "../models/Cart.js";

// Add to Cart
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

    if (!productId)
      return res.status(400).json({ message: "Product ID is required" });

  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    // Populate product details before returning
    await cart.populate("items.productId");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Cart
export const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
    );
    // ✅ FIX: Return empty cart instead of null
    if (!cart) return res.json({ items: [] });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Item
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    
    if (!cart) return res.status(404).json({ message: "Cart not found" });


    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId,
    );

    await cart.save();
    await cart.populate("items.productId");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Clear Cart
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteOne({ userId: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update Item Quantity
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1)
    return res.status(400).json({ message: "Valid quantity is required" });

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item._id.toString() === req.params.itemId,
    );

    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
