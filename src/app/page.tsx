"use client";

import { useSignIn, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/drive");
    }
  }, [isSignedIn, router]);

  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/drive",
        redirectUrlComplete: "/drive",
      });
    } catch (err) {
      const errorMessage =
      (err as { errors?: { message?: string }[] }).errors?.[0]?.message ?? "Google sign-in failed.";
      setError(errorMessage);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-stone-50 to-stone-500 text-white">
      <Image
        src="/images/logo.png"
        alt="Logo Watermark"
        className="pointer-events-none absolute z-0 items-center opacity-10 sm:w-2/4"
        width={500}
        height={500}
      />
      <div className="z-10 flex flex-col items-center">
        <h1 className="mb-6 text-center text-5xl font-bold">
          Welcome to CloudSync
        </h1>
        <p className="mb-6 text-lg">Your personal cloud storage solution</p>
        <div className="mb-6 flex space-x-8">
          <button
            onClick={handleGoogleSignIn}
            className="mt-2 flex w-full items-center justify-center space-x-2 rounded-md bg-stone-200 px-4 py-2 font-semibold text-stone-600 transition hover:bg-stone-500 hover:text-stone-200"
          >
            <Image
              src="/images/GoogleLogo.png"
              alt="Google Logo"
              className="h-6 w-6"
              width={24}
              height={24}
            />
            <span>Sign in with Google</span>
          </button>
        </div>
        {error && <p className="text-red-300 mt-4">{error}</p>}
      </div>
    </main>
  );
}