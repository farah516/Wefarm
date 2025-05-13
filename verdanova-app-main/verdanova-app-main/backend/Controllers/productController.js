// controllers/productController.js
const { Product, History } = require("../Models");
const { Op } = require("sequelize");

//addproduct
// Updated addProduct controller to handle image upload
const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      technicalDescription,
      productCategory,
      price,
      stock,
      productStatus,
      visibility,
      createdBy,
    } = req.body;

    if (!createdBy) {
      return res.status(403).json({ error: "User not authenticated" });
    }

    // Handle image upload
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = await Product.create({
      title,
      description,
      technicalDescription,
      productCategory,
      price,
      stock,
      productStatus,
      image, // Store the file path in the database
      visibility,
      popularity: 0, // Default value
      createdBy,
      userId: createdBy,
    });

    console.log("Product created:", newProduct);

    // Log the action in history
    await History.create({
      userId: createdBy,
      action: `Added product: ${title}`,
      timestamp: new Date(),
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Handle image upload if present
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update(updates);

    // Log the update action
    if (req.body.createdBy) {
      await History.create({
        userId: req.body.createdBy,
        action: `Updated product: ${product.title}`,
        timestamp: new Date(),
      });
    } else {
      console.error("User information is missing for logging");
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ error: "Failed to update product. Please try again later." });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    // Log the delete action
    await History.create({
      userId: product.createdBy,
      action: `Deleted product: ${product.title}`,
      timestamp: new Date(),
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Display Product
const displayProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List Products
const listProduct = async (req, res) => {
  try {
    console.log("Fetching products..."); // Ajout du log
    const products = await Product.findAll();
    console.log("Products fetched:", products); // Ajout du log
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error); // Ajout du log d'erreur
    res.status(500).json({ error: error.message });
  }
};

// Search Products
const searchProduct = async (req, res) => {
  try {
    const { query } = req.body;
    const products = await Product.findAll({
      where: {
        title: {
          [Op.like]: `%${query}%`,
        },
      },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  displayProduct,
  listProduct,
  searchProduct,
};
