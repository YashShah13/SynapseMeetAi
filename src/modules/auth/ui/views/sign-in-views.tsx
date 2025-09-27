"use client";

import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OctagonAlertIcon } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const SignInViews = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
      }
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);
    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden shadow-2xl border border-white/10 rounded-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-8 bg-white flex flex-col justify-center"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome Back 👋
                  </h1>
                  <p className="text-gray-500">Login to your account</p>
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                          className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                          className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Error alert */}
                {!!error && (
                  <Alert className="bg-red-100 border-red-300 text-red-800">
                    <OctagonAlertIcon className="h-4 w-4" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                {/* Submit */}
                <Button
                  disabled={pending}
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200"
                >
                  Sign In
                </Button>

                {/* Divider */}
                <div className="flex items-center my-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-2 text-sm text-gray-400">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Social logins */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    disabled={pending}
                    onClick={() => onSocial("google")}
                    variant="outline"
                    type="button"
                    className="w-full flex items-center gap-2 rounded-lg"
                  >
                    <FaGoogle /> Google
                  </Button>
                  <Button
                    disabled={pending}
                    onClick={() => onSocial("github")}
                    variant="outline"
                    type="button"
                    className="w-full flex items-center gap-2 rounded-lg"
                  >
                    <FaGithub /> GitHub
                  </Button>
                </div>

                {/* Sign up link */}
                <div className="text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="text-indigo-600 hover:underline"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          {/* Right Section */}
          <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 text-white hidden md:flex flex-col gap-y-4 items-center justify-center p-8">
            <Image
              src="/logo.png"
              alt="logo"
              width={92}
              height={92}
              className="rounded-lg"
            />
            <p className="text-2xl font-semibold">Synapse Meet.AI</p>
            <p className="text-indigo-200 text-sm">
              Smarter meetings powered by AI ✨
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-gray-500 text-center text-xs">
        © 2025 Synapse Meet.AI. All rights reserved.{" "}
        <a href="#" className="hover:text-indigo-500 underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:text-indigo-500 underline">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};
