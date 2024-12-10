import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import "../styles/style.css";

const EcommerceProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();

  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="small-container single-product">
        <div className="row">
          <div className="col-2">
            <img src={product.photo2} width="100%" id="ProductImg" />
          </div>
          <div className="col-2">
            <h1>{product.name}</h1>
            <h4>Rs. {product.price}.00</h4>

            <h3>
              PRODUCT DETAILS <i className="fa fa-indent" />
            </h3>
            <br />
            <p>{product.description}</p>
            <button
              className="btn btn-secondary ms-1"
              onClick={() => {
                setCart([...cart, product]);
                localStorage.setItem(
                  "cart",
                  JSON.stringify([...cart, product])
                );
                toast.success("Item Added to cart");
              }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* <!----------------- title --------------> */}
      {/* <div className="small-container">
        <div className="row row-2">
          <h2>Related Products</h2>
          <p>View More</p>
        </div>
      </div> */}

      {/* <!-------------- Our Products --------------> */}

      <div className="small-container">
        <div className="row row2">
          <h2>Related Products</h2>
          <p>View More</p>
        </div>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="row">
          {relatedProducts?.map((p) => (
            <div
              className="col-4"
              onClick={() => navigate(`/product/${p.slug}`)}
            >
              <img src={p.photo2} alt={p.name} className="img" />
              <h4>{p.name}</h4>
              <p>
                {p.price.toLocaleString("en-PK", {
                  style: "currency",
                  currency: "PKR",
                })}
              </p>
              <button
                className="btn btn-secondary ms-1"
                onClick={() => {
                  setCart([...cart, p]);
                  localStorage.setItem("cart", JSON.stringify([...cart, p]));
                  toast.success("Item Added to cart");
                }}
              >
                ADD TO CART
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default EcommerceProduct;
