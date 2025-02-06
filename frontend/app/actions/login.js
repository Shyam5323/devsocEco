"use server";

import { z } from "zod";
import { cookies } from "next/headers";

const schema = z.object({
  email: z.string().email().max(40),
  password: z.string().min(2).max(56),
});

export async function LoginUser(prevState, formData) {
  const cookieStore = await cookies();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const rawData = {

      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedData = schema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const backendResponse = await fetch(
      "http://localhost:5000/api/v1/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData.data),
      }
    );

    const { token } = await backendResponse.json();
    console.log(token);

    // Updated cookie settings
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    if (backendResponse.status === 200) {
      return {
        success: true,
        message: "Data saved successfully!",
      };
    } else {
      return {
        success: false,
        message: "Some error in backend",
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err.message || "An error occurred",
    };
  }
}
