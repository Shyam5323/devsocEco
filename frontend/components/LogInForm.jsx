"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const LogInForm = ({ onSingInSuccess }) => {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    submit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setErrors({ name: "", email: "", password: "", submit: "" });
    setIsSubmitting(true);

    try {
      const validatedData = formSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      });

      const submitData = {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
        country: "India",
      };

      console.log("Submitting form data", submitData);

      const response = await fetch(
        "http://localhost:5000/api/v1/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful", data);

      // Call the success callback with the token
      if (onSignUpSuccess && data.token) {
        await onSignUpSuccess(data.token);
      }
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const validationErrors = error.flatten().fieldErrors;
        setErrors((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(validationErrors).map(([key, messages]) => [
              key,
              messages[0],
            ])
          ),
        }));
      } else {
        setErrors((prev) => ({ ...prev, submit: error.message }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="startup-form space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="startup-form_label">
          Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Name"
          required
          className="startup-form_input"
        />
        {errors.name && (
          <div className="text-red-500 text-sm">{errors.name}</div>
        )}

        <label htmlFor="email" className="startup-form_label">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          className="startup-form_input"
        />
        {errors.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        <label htmlFor="password" className="startup-form_label">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          className="startup-form_input"
        />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        {errors.submit && (
          <div className="text-red-500 text-sm mt-2">{errors.submit}</div>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default LogInForm;
