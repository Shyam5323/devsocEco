import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { signIn, signOut, useSession } from "@/auth";

const Navbar = () => {
  return (
    <section className="navbar flex flex-row justify-between items-center p-4">
      <Image src={"/logo.png"} alt="logo" width={100} height={100} />
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <Button type="submit" >Sign Up</Button>
        {/* <Button type="submit">Signin with Google</Button> */}
      </form>
    </section>
  );
};

export default Navbar;
