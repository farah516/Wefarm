import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    stock: { type: Number, required: true },
    status: { type: String, required: true, enum: ["In Stock", "Low Stock", "Out of Stock"] },
    image: { type: String, required: true},
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;  // Utilisation d'exportation par défaut
