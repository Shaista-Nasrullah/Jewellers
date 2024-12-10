import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { GiShoppingBag } from "react-icons/gi";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { FiAlignRight } from "react-icons/fi";
import { ImCross } from "react-icons/im";
import { IoIosArrowDown } from "react-icons/io";
import SearchInput from "../Form/SearchInput";
import { FaCartShopping } from "react-icons/fa6";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import "../../styles/myHeader.css";

const Header = () => {
  const categories = useCategory();
  const [cart] = useCart();
  const [auth, setAuth] = useAuth();

  // State for toggling the menu visibility
  const [isMenuVisible, setMenuVisible] = useState(false);

  // State for toggling categories dropdown
  const [isCategoriesDropdownVisible, setCategoriesDropdownVisible] =
    useState(false);

  // Toggle the menu visibility
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  // Toggle categories dropdown visibility
  const toggleCategoriesDropdown = () => {
    setCategoriesDropdownVisible(!isCategoriesDropdownVisible);
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully!");
  };

  return (
    <>
      <header className="header">
        <nav className="nav container">
          <div className="nav__data">
           
            <li>
                <NavLink to="/cart" className="nav-link card-item">
                  <Badge count={cart?.length}>
                  <GiShoppingBag className="bag"/>
                  </Badge>
                </NavLink>
              </li>
            <SearchInput className="bag" />

            <Link to="/" className="nav__logo name">
               Haji Jewellers
              
            </Link>

            {/* Toggle button for burger and close icons */}
            <div
              className={`nav__toggle ${isMenuVisible ? "show-icon" : ""}`}
              onClick={toggleMenu}
            >
              {isMenuVisible ? (
                <ImCross className="nav__close" /> // Close icon
              ) : (
                <FiAlignRight className="nav__burger" />
              )}
            </div>
          </div>

          

            <div className={`nav__menu ${isMenuVisible ? "show-menu" : ""}`}>
              <ul className="nav__list">
                <li>
                  <NavLink to="/" className="nav__link">
                    Home
                  </NavLink>
                </li>

                {/* Categories dropdown */}
                <li
                  className="dropdown__item"
                  onClick={toggleCategoriesDropdown}
                >
                  <div className="nav__link">
                    Categories <IoIosArrowDown className="dropdown__arrow" />
                  </div>
                  <ul
                    className={`dropdown__menu ${
                      isCategoriesDropdownVisible ? "show" : ""
                    }`}
                  >
                    <li>
                      <Link className="dropdown__link" to="/categories">
                        All Categories
                      </Link>
                    </li>
                    {categories?.map((c) => (
                      <li key={c._id}>
                        <Link
                          className="dropdown__link"
                          to={`/category/${c.slug}`}
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Authentication Links */}
                {!auth.user ? (
                  <>
                    <li>
                      <NavLink to="/register" className="nav__link">
                        Sign up
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/login" className="nav__link">
                        Login
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <li className="dropdown__item">
                    <div className="nav__link">
                      {auth.user.name}{" "}
                      <IoIosArrowDown className="dropdown__arrow" />
                    </div>
                    <ul className="dropdown__menu">
                      <li>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                          className="dropdown__link"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/login"
                          className="dropdown__link"
                          onClick={handleLogout}
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
