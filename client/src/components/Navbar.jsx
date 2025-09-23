import React from "react";
import { NavLink } from "react-router-dom";
import Theme from "./Theme";

const Navbar = () => {
  const linkClasses = ({ isActive, isPending }) =>
    isPending
      ? "pending"
      : isActive
      ? "text-[var(--primary)] underline underline-offset-8"
      : "";
  return (
    <nav className="top-0 fixed h-16 w-full flex md:justify-around justify-between px-10 md:px-0 items-center bg-[var(--bg)]">
      <h1 className="text-2xl text-[var(--text)]">AuthSys</h1>
      <div className="hidden md:flex space-x-5 ">
        <NavLink to={"/"} className={linkClasses}>
          Home
        </NavLink>
        <NavLink to={"/signup"} className={linkClasses}>
          Signup
        </NavLink>
        <NavLink to={"/login"} className={linkClasses}>
          Login
        </NavLink>
      </div>
      <Theme />
    </nav>
  );
};

export default Navbar;
