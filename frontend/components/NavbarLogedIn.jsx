import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { signIn, signOut, useSession } from "@/auth";
import Link from "next/link";

const NavbarLI = () => {
  return (
    <section className="navbar flex flex-row justify-between items-center p-2 gap-x-5 w-full">
      <Image src={"/logo.png"} alt="logo" width={100} height={100} />
      <form
        className="flex gap-4 w-full px-2" // Add padding on both sides
      >
        
        <div className="max-w-7xl mx-auto flex items-center p-4 space-x-4">
        <Link href="/">
          <Button type="submit" className = "flex-1 flex justify-start ">Home</Button>
        </Link>
        <Link href="/leaderboard">
          <Button type="submit" className = "flex-1 flex justify-start">LeaderBoard</Button>
        </Link>
        <Link href="/dashboard">
          <Button type="submit" className = "flex-1 flex justify-start">Dashboard</Button>
        </Link>
        </div>
      </form>
    </section>
  );
};

export default NavbarLI;
