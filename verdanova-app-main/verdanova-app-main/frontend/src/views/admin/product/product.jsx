import React, { useEffect, useState } from "react";
import TopCreatorTable from "./components/table"; // Vérifiez le chemin
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/list`);
            setProducts(response.data);
        } catch (err) {
          setError('Échec de l\'obtention des produits. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
  }, []);

  const tableColumns = [
    { Header: 'Title', accessor: 'title' },
    { Header: 'Category', accessor: 'productCategory' },
    { Header: 'Price', accessor: 'price' },
    { Header: 'Stock', accessor: 'stock' },
    { Header: 'Status', accessor: 'productStatus' }
  ];

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 ">
      <div className="pt-12">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="h-[600px] overflow-y-auto">
            <TopCreatorTable
              extra="mb-5"
              tableData={products}
              columnsData={tableColumns}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
