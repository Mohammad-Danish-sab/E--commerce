import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        price: Number,
        image: String,
        quantity: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    // ✅ Added shipping address for completeness
    shippingAddress: {
      type: String,
      default: "",
    },
  },
  
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
