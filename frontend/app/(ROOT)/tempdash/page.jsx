import React from "react";
import { cookies } from "next/headers";
import LogoutButton from "@/components/LogoutButton";
import { redirect } from "next/navigation";
const dashboard = async () => {
  const cookie = await cookies();
  const token = await cookie.get("auth_token");
  if (!token) {
    return <div>Unauthorized</div>;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        redirect("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <div>{/* <LogoutButton onLogout={handleLogout} /> */}</div>;
};

export default dashboard;
