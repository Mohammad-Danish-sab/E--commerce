import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
    );

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0,
    );

    const order = await Order.create({
      userId: req.user.id,
      products: cart.items,
      totalAmount,
    });

    await Cart.deleteOne({ userId: req.user.id });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
