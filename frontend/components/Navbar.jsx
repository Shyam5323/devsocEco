import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <section className="navbar flex flex-row justify-between items-center p-4">
      <Image src={"/logo.png"} alt="logo" width={100} height={100} />
      <form>
        <Link href="/login">
          <Button type="button">Log In</Button>
        </Link>
      </form>
    </section>
  );
};

export default Navbar;
