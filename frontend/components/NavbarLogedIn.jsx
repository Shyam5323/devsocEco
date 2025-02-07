import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { signIn, signOut, useSession } from "@/auth";

const NavbarLI = () => {
  return (
    <section className="navbar flex flex-row justify-between items-center p-2 gap-x-5 w-full">
      <Image src={"/logo.png"} alt="logo" width={100} height={100} />
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
        className="flex gap-4 w-full px-2" // Add padding on both sides
      >
        <Button type="submit" className="flex-1">
          Home
        </Button>
        <Button type="submit" className="flex-1">
          Leaderboard
        </Button>
        <Button type="submit" className="flex-1">
          Dashboard
        </Button>
      </form>
    </section>
  );
};

export default NavbarLI;
