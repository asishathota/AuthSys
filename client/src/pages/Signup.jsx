import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [signUpFormData, setSignUpFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);

  const changeValue = (e) => {
    const { name, value } = e.target;
    setSignUpFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimData = {
      username: signUpFormData.username.trim(),
      email: signUpFormData.email.trim(),
      password: signUpFormData.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          username: trimData.username,
          email: trimData.email,
          password: trimData.password,
        }
      );

      if (response.data.status === "success") {
        setSignUpFormData(() => ({
          username: "",
          email: "",
          password: "",
        }));
        navigate("/email");
      }
    } catch (error) {
      console.error("Error in signup: ", error);
    }
  };

  const inputClass =
    "text-[var(--text)] px-3 py-2 outline-none border-b border-[var(--border-muted)] w-full focus:border-[var(--border)] text-sm";

  return (
    <form
      action=""
      className="flex flex-col justify-start items-start bg-[var(--bg)] h-fit w-[350px] mt-36 md:mt-28 space-y-5 p-5 border border-[var(--border)] rounded-2xl mx-auto"
    >
      <div className="flex justify-around space-x-5 items-center w-full mb-10">
        <div className="p-4 bg-[var(--bg-light)] rounded-full border border-[var(--border-muted)]">
          <FaUserPlus className="size-10" />
        </div>
        <div className="space-y-2">
          <h1 className="md:text-2xl text-xl text-[var(--text)]">Signup</h1>
          <p>Create an User Account</p>
        </div>
      </div>
      <div className="flex flex-col space-y-7 text-lg w-full">
        <div className="flex flex-col items-start justify-start">
          <label htmlFor="username">username:</label>
          <input
            type="text"
            name="username"
            value={signUpFormData.username}
            onChange={changeValue}
            placeholder="asishathota"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col items-start justify-start">
          <label htmlFor="email">email:</label>
          <input
            type="email"
            name="email"
            value={signUpFormData.email}
            onChange={changeValue}
            placeholder="something@gmail.com"
            className={inputClass}
          />
        </div>
        <div className="relative flex flex-col items-start justify-start">
          <label htmlFor="password">password:</label>
          <input
            type={showPass ? "text" : "password"}
            name="password"
            value={signUpFormData.password}
            onChange={changeValue}
            placeholder="•••••••••••••"
            className={inputClass}
          />
          <button
            className="absolute inset-y-0 right-2 top-7 flex items-center text-[var(--text-muted)] hover:text-[var(--text)] transition"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              setShowPass((prev) => !prev);
            }}
          >
            {showPass ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>
      <button
        className="w-full bg-[var(--border)] text-[var(--text)] rounded-xl px-3 py-2"
        onClick={handleSubmit}
      >
        Signup
      </button>
      <div className="flex items-center justify-center space-x-4 w-full">
        <div className="border border-[var(--border)] w-[40%]"></div>
        <p className="">or</p>
        <div className="border border-[var(--border)] w-[40%]"></div>
      </div>
      <div className="flex justify-center items-center w-full">
        <p>
          Already have an account?{" "}
          <strong>
            <button
              className="hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </strong>
        </p>
      </div>
    </form>
  );
};

export default Signup;
