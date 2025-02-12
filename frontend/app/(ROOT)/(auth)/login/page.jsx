"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie"; // To store the token in cookies
import LoginForm from "@/components/LogInForm";

const LoginPage = () => {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1/users/login", {
        email,
        password,
      });

      const { token } = response.data;
      console.log(token)
      if (token) {
        Cookies.set("auth_token", token, { expires: 7, path: "/" }); // Store token in cookies (valid for 7 days)
        router.push("/dashboard"); // Redirect to dashboard after login
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="bg-secondary h-screen flex items-center justify-center">
      <div className="bg-white rounded-[30px] h-5/6 w-5/6 flex">
        {/* Left Side: Login Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>
          <h3 className="text-2xl font-extralight mb-6 text-center">
            Welcome Back to Ecotrackr
          </h3>
          
          {/* Pass handleLogin to LoginForm */}
          <LoginForm onLogin={handleLogin} />

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <div className="text-center mt-4">
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="w-1/2 bg-gray-100 rounded-r-[30px] flex items-center justify-center">
          <img
            src="/signUp.png"
            alt="Signup illustration"
            className="max-w-full max-h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
