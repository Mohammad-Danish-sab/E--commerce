import { useEffect, useState } from "react";

import api from "../services/adminAPI";

const useDashboard = () => {
  const [data, setData] = useState({
    products: 0,

    users: 0,

    orders: 0,

    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const products = await api.get("/products");

      setData({
        products: products.data.length,

        users: 0,

        orders: 0,

        revenue: 0,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,

    loading,
  };
};

export default useDashboard;
