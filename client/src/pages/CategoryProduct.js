import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);
  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mt-3">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>
       
        <div className="container">
        <div className="row">
          {products?.map((p) => (
            <>
              <div
                className="col-4"
                onClick={() => navigate(`/product/${p.slug}`)}
              >
                <img src={p.photo2} className="image" alt={p.name} />
                <h4>{p.name}</h4>
                <p>
                  {p.price.toLocaleString("en-PK", {
                    style: "currency",
                    currency: "PKR",
                  })}
                </p>
              </div>
            </>
          ))}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;