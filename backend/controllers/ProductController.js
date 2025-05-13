import Product from '../models/ProductModel.js';  // Importation avec modules ES
import upload from '../middleware/upload.js';     // Importation du middleware multer

// Create a new product
export const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { name, category, price, stock, status, description } = req.body;
    const image = req.file.path; // Le chemin de l'image téléchargée

    const newProduct = new Product({
      name,
      category,
      price,
      stock,
      status,
      image,  // Le chemin de l'image
      description,
    });

    const product = await newProduct.save();
    res.status(201).json(product); // Renvoyer le produit avec l'image
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};


// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const { name, category, price, stock, status, image, description } = req.body;

    // Vérifiez si une nouvelle image est téléchargée
    const newImage = req.file ? req.file.path : image; // Si une nouvelle image est téléchargée, utilisez-la

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price,
        stock,
        status,
        image: newImage,
        description,
      },
      { new: true } // Retourner le produit mis à jour
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product" });
  }
};
