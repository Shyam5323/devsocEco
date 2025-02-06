
import React from "react";
import LoginForm from "@/components/LogInForm";

const LoginPage = () => {
  return (
    <div className="bg-secondary h-screen flex items-center justify-center">
      <div className="bg-white rounded-[30px] h-5/6 w-5/6 flex">
        {/* Left Side: Login Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>
          <h3 className="text-2xl font-extralight mb-6 text-center">
            Welcome Back to Ecotrackr
          </h3>
          <LoginForm />

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
            src="./signUp.png"
            alt="Signup illustration"
            className="max-w-full max-h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
