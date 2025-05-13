import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import path from "path";
import invoiceRoutes from './routes/invoiceRoutes.js';

dotenv.config();

const app = express();


const corsOptions = {
  origin: 'http://localhost:8080', 
  methods: ['GET', 'POST', 'DELETE', 'PUT'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};
app.use(cors(corsOptions));

app.use(express.json()); 

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use('/api', invoiceRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
