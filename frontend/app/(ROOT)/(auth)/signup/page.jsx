import React from "react";
import SignUpForm from "@/components/SignUpForm";

const SignUpWrapper = () => {

  return (
    <div className="bg-secondary h-screen flex items-center justify-center">
      <div className="bg-white rounded-[30px] h-5/6 w-5/6 flex">
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
          <h3 className="text-2xl font-extralight mb-6 text-center">
            Welcome to Ecotrackr - Let's create an account
          </h3>

          <SignUpForm />

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>

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

export default SignUpWrapper;
