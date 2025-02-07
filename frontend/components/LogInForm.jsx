"use client";

import { useActionState } from "react";
import { LoginUser } from "@/app/actions/login";
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

export default function LoginForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(LoginUser, initialState);

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  }, [state.success, router]);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent>
        <form action={action} className="space-y-6" autoComplete="on">
          <div className="space-y-4">
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                maxLength={56}
                autoComplete="current-password"
                aria-describedby="password-error"
                className={state?.errors?.password ? "border-red-500" : ""}
              />
              {state?.errors?.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {state.errors.password[0]}
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
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
