import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import "../styles/cartPage.css";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const navigate = useNavigate();

  // Total price calculation
  const totalPrice = () => {
    try {
      let total = cart?.reduce((acc, item) => acc + (item.price || 0), 0);
      return total.toLocaleString("en-PK", {
        style: "currency",
        currency: "PKR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Remove cart item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      if (index !== -1) {
        myCart.splice(index, 1);
        setCart(myCart);
        localStorage.setItem("cart", JSON.stringify(myCart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle payments
  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        {
          paymentMethod,
          cart,
        }
      );
      // Assuming payment succeeded if we reach this point
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Order Completed Successfully ");
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          {/* Cart items section */}
          <div className="col-md-6">
            {cart?.length > 0 ? (
              cart.map((p) => (
                <div className="cart-info" key={p._id}>
                  <img className="my-image" src={p.photo2} alt={p.name} />
                  <div>
                    <p>{p.name}</p>
                    <small>
                      {p.price.toLocaleString("en-PK", {
                        style: "currency",
                        currency: "PKR",
                      })}
                    </small>
                    <br />
                    <button
                      className="remove"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Your Cart is Empty</p>
            )}
          </div>

          {/* Cart summary section */}
          <div className="col-md-6 text-center">
            <h6>Cart Summary</h6>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total: {totalPrice()}</h4>

            {auth?.user?.address ? (
              <div className="mb-3">
                <h5>Current Address: {auth?.user?.address}</h5>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Update Address
                </button>
              </div>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="remove"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/login", { state: "/cart" })}
                  >
                    Please Login to checkout
                  </button>
                )}
              </div>
            )}

            {/* Payment method section */}
            <div className="mt-2">
              {cart?.length > 0 && (
                <>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value="Cash on Delivery"
                        checked={paymentMethod === "Cash on Delivery"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />{" "}
                      Cash on Delivery
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value="Direct Bank Transfer"
                        checked={paymentMethod === "Direct Bank Transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />{" "}
                      Direct Bank Transfer
                    </label>
                  </div>

                  {paymentMethod === "Direct Bank Transfer" && (
                    <div className="mt-3">
                      <h5>Bank Account Details:</h5>
                      <p>Account Number: 000245689213</p>
                      <p>Account Title: Shaista</p>
                      <p>Easypaisa Number: 0309-2791105</p>
                    </div>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={!auth?.user?.address}
                  >
                    Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
