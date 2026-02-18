import Cart from "../models/Cart.js";

// Add to Cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

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
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Item
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId,
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
