import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
 const { title, price, description, category } = req.body;

 if (!title || !price || !description)
   return res
     .status(400)
     .json({ message: "Title, price and description are required" });

      const image = req.file ? req.file.path : req.body.image;

      if (!image)
        return res.status(400).json({ message: "Product image is required" });


    const product = await Product.create({
      title,
      price,
      description,
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    // ✅ Support optional category filter: GET /api/products?category=electronics
    const filter = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // ✅ FIX: Handle product not found
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { title, price, description, category } = req.body;

    // ✅ If a new image is uploaded, use it; otherwise keep existing
    const updateData = { title, price, description, category };
    if (req.file) updateData.image = req.file.path;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
