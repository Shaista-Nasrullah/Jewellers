import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios(
        `${process.env.REACT_APP_API}/api/v1/category/categories`
      );
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong while getting categories");
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );

      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    } else {
      getAllProducts();
    }
  }, [checked, radio]);

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const FilterByCategory = ({ categories, checked, setChecked }) => {
    const [showCategoryFilters, setShowCategoryFilters] = useState(false);

    const handleCategoryButtonClick = () => {
      setShowCategoryFilters(!showCategoryFilters);
      console.log("Filter button clicked. Show filters:", !showCategoryFilters); // Debugging
    };

    const handleCategoryFilter = (isChecked, categoryId) => {
      const updatedChecked = isChecked
        ? [...checked, categoryId]
        : checked.filter((id) => id !== categoryId);

      setChecked(updatedChecked);
      console.log("Checked categories:", updatedChecked); // Debugging
    };

    return (
      <div className="filter-category">
        <button
          onClick={handleCategoryButtonClick}
          className="filter-toggle-button"
        >
          Filter By Category
        </button>
        {showCategoryFilters && (
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleCategoryFilter(e.target.checked, c._id)}
                checked={checked.includes(c._id)} // Keep checkbox state in sync
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
        )}
      </div>
    );
  };

  const FilterByPrice = ({ onFilter }) => {
    const [showPriceFilters, setShowPriceFilters] = useState(false);

    const handlePriceButtonClick = () => {
      setShowPriceFilters(!showPriceFilters);
    };

    const handlePriceFilter = (value) => {
      setRadio(value);
      setShowPriceFilters(false);
    };

    return (
      <div className="filter-price">
        <button
          onClick={handlePriceButtonClick}
          className="filter-toggle-button"
        >
          Filter By Price
        </button>
        {showPriceFilters && (
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => handlePriceFilter(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout title={"All products-Best Offers | Haji Jewellers"}>
      <div className="main">
        <img src="images/Haji-jewellers2.png" alt="Haji" />
      </div>

      {/* ------------collections starts---------------- */}

      <div className="categories">
        <div className="small-container">
          <div className="row">
            <div className="col-3">
              <img src="images/col1.png" alt="silver-jewellery" />
            </div>
            <div className="col-3">
              <img src="images/collection3.png" alt="Gold-jewellery" />
            </div>
            <div className="col-3">
              <img src="images/collection2.png" alt="Natiral-stones" />
            </div>
          </div>
        </div>
      </div>

      {/* ------------collection starts---------------- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <FilterByCategory
          categories={categories}
          checked={checked} // Pass the checked state
          setChecked={setChecked} // Pass the setChecked function
          onFilter={setChecked}
        />

        <FilterByPrice onFilter={setRadio} />
      </div>

      <div className="d-flex justify-content-center my-3">
        <button
          className="all-products"
          onClick={() => window.location.reload()}
        >
          All Products
        </button>
      </div>
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
      <div className="m-2 p-3">
        {products && products.length < total && (
          <button
            className="btn btn-warning"
            onClick={(e) => {
              e.preventDefault();
              setPage(page + 1);
            }}
          >
            {loading ? "Loading ..." : "Loadmore"}
          </button>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
