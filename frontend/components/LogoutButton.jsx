"use client"
import React from "react";
import { Button } from "./ui/button";
import {Logout} from "../app/actions/logout.js";
import { useRouter } from "next/navigation";


const LogoutButton = () => {
  const router = useRouter();
  const handleClick = async () => {
      await Logout();
      router.push('/login');
  };
  return <Button onClick={handleClick}> Logout </Button>;
};

export default LogoutButton;
