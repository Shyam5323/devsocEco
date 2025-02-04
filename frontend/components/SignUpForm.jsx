"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/actions/register";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const initialState = {
  success: false,
  message: "",
};

export default function SignUpForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(registerUser, initialState);

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  }, [state.success, router]);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>Please enter your details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6" autoComplete="on">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="streetAddress">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Mr. John Doe"
                required
                minLength={3}
                maxLength={25}
                autoComplete="name"
                aria-describedby="name-error"
                className={state?.errors?.name ? "border-red-500" : ""}
              />
              {state?.errors?.name && (
                <p id="name-error" className="text-sm text-red-500">
                  {state.errors.name[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="example@gmail.com"
                maxLength={40}
                required
                autoComplete="email"
                aria-describedby="email-error"
                className={state?.errors?.email ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                placeholder="United States"
                required
                minLength={2}
                maxLength={56}
                autoComplete="country-name"
                aria-describedby="country-error"
                className={state?.errors?.country ? "border-red-500" : ""}
              />
              {state?.errors?.country && (
                <p id="country-error" className="text-sm text-red-500">
                  {state.errors.country[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                required
                minLength={2}
                maxLength={56}
                autoComplete="new-password"
                aria-describedby="password-error"
                className={state?.errors?.password ? "border-red-500" : ""}
              />
              {state?.errors?.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {state.errors.country[0]}
                </p>
              )}
            </div>
          </div>
          {state?.message && (
            <Alert variant={state.success ? "default" : "destructive"}>
              {state.success && <CheckCircle2 size={24} />}
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
