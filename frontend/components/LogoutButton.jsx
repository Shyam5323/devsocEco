"use client";
import React from "react";
import { Button } from "./ui/button";

const LogoutButton = (onLogout) => {
  const handleClick = async () => {
    await onLogout();
  };
  return <Button onClick={handleClick}> Logout </Button>;
};

export default LogoutButton;
