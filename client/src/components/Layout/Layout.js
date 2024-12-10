import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";


const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charset="UTF-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Toaster />
        {children}
      </main>
     
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Haji Jewellers - shop now",
  description:
    "natural stones, silver ring for men and women, Gold, Gold Rings, Gold Bengals, handmade rings, silver",
  keywords:
    "natural stones, silver ring for men and women, Gold, Gold Rings, Gold Bengals, handmade rings, silver",
  author: "Shaista Nasrullah",
};

export default Layout;
