import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { signIn, signOut, useSession } from "@/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const NavbarLI = () => {
  return (
    <nav className="navbar flex items-center p-2 gap-x-5 w-full bg-white shadow-md">
      {/* Logo */}
      <Image src="/logo.png" alt="logo" width={100} height={100} />

      {/* Button Container - Full Width */}
      <div className="flex w-full gap-4 px-2">
        <Link href="/" className="flex-1">
          <Button className="w-full">Home</Button>
        </Link>
        <Link href="/leaderboard" className="flex-1">
          <Button className="w-full">Leaderboard</Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button className="w-full">Dashboard</Button>
        </Link>
        <LogoutButton/>
      </div>
    </nav>
  );
};

export default NavbarLI;
