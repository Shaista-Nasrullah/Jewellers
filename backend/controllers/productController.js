import { uploadOnCloudinary } from "../helpers/cloudinary.js";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import slugify from "slugify";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    if (
      [name, description, price, category, quantity].some(
        (field) => field?.trim() === ""
      )
    ) {
      return res.status(400).send({
        message: "All fields are required!",
      });
    }
    const existingProduct = await productModel.findOne({
      $or: [{ name }, { description }],
    });
    if (existingProduct) {
      return res.status(409).send({
        success: true,
        message: "Product already exist with this name or description",
      });
    }

    const firstPhotoPath = req.files?.photo2?.[0]?.path;

    if (!firstPhotoPath) {
      return res.status(400).send({
        message: "First photo of product is required",
      });
    }

    const photo2 = await uploadOnCloudinary(firstPhotoPath);
    if (!photo2) {
      return res.status(400).send({
        message: "Error uploading first photo",
      });
    }

    let secondPhotoPath;
    if (
      req.files &&
      Array.isArray(req.files.secondPhoto) &&
      req.files.secondPhoto.length > 0
    ) {
      secondPhotoPath = req.files.secondPhoto[0].path;
    }

    const secondPhoto = await uploadOnCloudinary(secondPhotoPath);

    let thirdPhotoPath;
    if (
      req.files &&
      Array.isArray(req.files.thirdPhoto) &&
      req.files.thirdPhoto.length > 0
    ) {
      thirdPhotoPath = req.files.thirdPhoto[0].path;
    }

    const thirdPhoto = await uploadOnCloudinary(thirdPhotoPath);

    const product = await productModel.create({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      photo2: photo2.url,
      secondPhoto: secondPhoto?.url || "",
      thirdPhoto: thirdPhoto?.url || "",
      quantity,
    });
    return res.status(201).send({
      success: true,
      message: "New product created!",
      product,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while creating product",
    });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("category");
    res.status(200).json({
      success: true,
      totalProducts: products.length,
      message: "List of products",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting products",
    });
  }
};

//get single product
export const getProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while getting single product",
    });
  }
};

//updating product

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    const { id } = req.params;

    // Validate required fields
    if (
      [name, description, price, category, quantity].some(
        (field) => field?.trim() === ""
      )
    ) {
      return res.status(400).send({
        message: "All fields are required!",
      });
    }

    // Check if the product exists
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({
        message: "Product not found!",
      });
    }

    // Handle photos if provided
    let photo2 = product.photo2;
    let secondPhoto = product.secondPhoto;
    let thirdPhoto = product.thirdPhoto;

    const firstPhotoPath = req.files?.photo2?.[0]?.path;
    const secondPhotoPath = req.files?.secondPhoto?.[0]?.path;
    const thirdPhotoPath = req.files?.thirdPhoto?.[0]?.path;

    if (firstPhotoPath) {
      const uploadedFirstPhoto = await uploadOnCloudinary(firstPhotoPath);
      if (uploadedFirstPhoto) {
        photo2 = uploadedFirstPhoto.url;
      } else {
        return res.status(500).send({
          message: "Error uploading first photo",
        });
      }
    }

    if (secondPhotoPath) {
      const uploadedSecondPhoto = await uploadOnCloudinary(secondPhotoPath);
      if (uploadedSecondPhoto) {
        secondPhoto = uploadedSecondPhoto.url;
      } else {
        return res.status(500).send({
          message: "Error uploading second photo",
        });
      }
    }

    if (thirdPhotoPath) {
      const uploadedThirdPhoto = await uploadOnCloudinary(thirdPhotoPath);
      if (uploadedThirdPhoto) {
        thirdPhoto = uploadedThirdPhoto.url;
      } else {
        return res.status(500).send({
          message: "Error uploading third photo",
        });
      }
    }

    // Update the product
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
        description,
        price,
        category,
        photo2,
        secondPhoto,
        thirdPhoto,
        quantity,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating product",
    });
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: error.message,
    });
  }
};

//filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

//product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in products count",
      error,
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 20;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("photo2 name price  slug")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

//similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      // .select("-photo")
      .limit(4)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

export const brainTreePaymentController = async (req, res) => {
  try {
    const { paymentMethod, cart } = req.body;

    // Calculate total amount
    let total = 0;
    cart.forEach((item) => {
      total += item.price;
    });

    // Handle payment based on the selected method
    if (
      paymentMethod === "Cash on Delivery" ||
      paymentMethod === "Direct Bank Transfer"
    ) {
      // Save the order in the database
      const order = new orderModel({
        products: cart,
        payment: { method: paymentMethod }, // Save as an object with 'method' property
        buyer: req.user._id,
      });

      await order.save();

      // Respond with success message
      res.json({ ok: true, message: "Order placed successfully" });
    } else {
      // Invalid payment method
      res.status(400).json({ error: "Invalid payment method" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};
