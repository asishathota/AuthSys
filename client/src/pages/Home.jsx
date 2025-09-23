import React from "react";

const Home = () => {
  return (
    <div className="bg-[var(--bg)] min-h-[100dvh] flex justify-start items-center flex-col md:pt-40 pt-36 px-4 space-y-5">
      <h1 className="md:text-5xl text-3xl font-sans font-bold leading-20 bg-transparent bg-clip-text bg-gradient-to-r from-[var(--text)] to-[var(--text-muted)]">
        Authentication System
      </h1>
      <div className="flex flex-col space-y-5">
        <h2 className="md:text-2xl text-lg font-sans text-start px-2 font-semibold text-[var(--text-muted)]">
          This project is a basic authentication system where users can:
        </h2>
        <ul className="list-disc ml-10 flex flex-col space-y-5">
          <li>
            <strong>Sign Up</strong> - Create an account with their details.
          </li>
          <li>
            <strong>Login & Logout</strong> - Securely access and exit their
            account using sessions.
          </li>
          <li>
            <strong>Email Verification</strong> - Confirm their identity via a
            verification email before account activation.
          </li>
        </ul>
      </div>
      <div className="flex justify-around items-center py-10 px-10 md:space-x-30 space-x-20 mt-10 md:mt-0">
        <button className="px-5 py-3 border-2 border-[var(--border-muted)] rounded-lg bg-[var(--bg-light)] cursor-pointer hover:bg-[var(--bg)] duration-200 transition-colors active:bg-[var(--bg)] text-[var(--text)] w-32">
          Signup
        </button>
        <button className="px-5 py-3 border-2 border-[var(--border-muted)] rounded-lg bg-[var(--bg-light)] cursor-pointer hover:bg-[var(--bg)] duration-200 transition-colors active:bg-[var(--bg)] text-[var(--text)] w-32">
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;
