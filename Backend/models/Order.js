import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: Array,
    totalAmount: Number,
    status: {
      type: String,
      default: "Processing",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
