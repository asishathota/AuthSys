import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Email from "./pages/Email";
import ResetPass from "./pages/ResetPass";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col text-[var(--text-muted)] bg-[var(--bg)]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email" element={<Email />} />
        <Route path="/resetpassword" element={<ResetPass />} />
      </Routes>
    </div>
  );
};

export default App;
