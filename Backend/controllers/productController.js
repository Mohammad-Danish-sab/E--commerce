import Product from "../models/Product.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { title, price, description } = req.body;

    const product = await Product.create({
      title,
      price,
      description,
      image: req.file?.path, // ⭐ IMPORTANT
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { title, price, description } = req.body;

    const updatedData = {
      title,
      price,
      description,
    };

    if (req.file) {
      updatedData.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
