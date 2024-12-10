import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import "../styles/home.css";

const Search = () => {
  const [values, setValues] = useSearch();
  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Resuts</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((p) => (
              <>
                <div className="col-4">
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

export default Search;
