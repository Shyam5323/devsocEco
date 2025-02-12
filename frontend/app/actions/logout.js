"use server";

import { z } from "zod";
import { cookies } from "next/headers";

export async function Logout(req,res) {
    const cookiestore = await cookies();
    await cookiestore.delete("auth_token");

    return {
        success: true,
        message: "success"
      };

}