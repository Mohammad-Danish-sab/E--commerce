import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
    );

    // ✅ FIX: Handle empty/missing cart
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // ✅ FIX: Check all items have valid populated products
    const hasInvalidItems = cart.items.some(
      (item) => !item.productId || !item.productId.price,
    );
    if (hasInvalidItems)
      return res
        .status(400)
        .json({ message: "One or more cart items are invalid" });

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0,
    );

    // ✅ FIX: Store a clean snapshot of products (not just ObjectId refs)
    const products = cart.items.map((item) => ({
      productId: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity,
    }));

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
// Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get Single Order
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Only allow the owner to view the order
    if (order.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
