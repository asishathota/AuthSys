import React from "react";
import { NavLink } from "react-router-dom";
import Theme from "./Theme";

const Navbar = () => {
  return (
    <nav className="top-0 fixed h-16 w-full flex md:justify-around justify-between px-10 md:px-0 items-center bg-[var(--bg)] shadow-md">
      <h1 className="text-2xl text-[var(--text)]">AuthSys</h1>
      <div className="hidden md:flex space-x-5 ">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/login"}>Login</NavLink>
        <NavLink to={"/signup"}>Signup</NavLink>
      </div>
      <Theme />
    </nav>
  );
};

export default Navbar;
