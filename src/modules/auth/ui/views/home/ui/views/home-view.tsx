"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut } from "lucide-react";

export const HomeView = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.push("/sign-in"),
          onError: (error) => {
            console.error("Sign out failed:", error);
            setIsSigningOut(false);
          },
        },
      });
    } catch (error) {
      console.error("An unexpected error occurred during sign out:", error);
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="p-8 flex flex-col items-center gap-8">
        <Skeleton className="h-9 w-96" />
        <Skeleton className="h-12 w-40" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p>No active session found.</p>
        <Button onClick={() => router.push("/sign-in")} className="mt-4">
          Go to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-foreground tracking-tight">
        Welcome back, {session.user.name}
      </h1>

      <Button
        onClick={handleSignOut}
        disabled={isSigningOut}
        size="lg"
        className="font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
      >
        <LogOut className="mr-2 h-20 w-3" />
        {isSigningOut ? "Signing Out..." : "Sign Out"}
      </Button>
    </div>
  );
};