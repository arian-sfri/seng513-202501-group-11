"use client";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function LandingPage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-stone-50 to-stone-500 text-white">
      <img
        src="/images/logo.png"
        alt="Logo Watermark"
        className="absolute z-0 w-2/3 opacity-10 pointer-events-none"
      />
      <div className="z-10 flex flex-col items-center">
        <h1 className="mb-6 text-5xl font-bold">Welcome to CloudSync</h1>
        <p className="mb-6 text-lg">Your personal cloud storage solution</p>
        <div className="mb-6 flex space-x-8">
        <Link href="/sign-in">
            <Button
            className="rounded-md bg-stone-50 px-4 py-[20px] text-lg font-semibold text-stone-700 transition hover:bg-stone-500 hover:text-white"
            size="lg"
            >
              Get Started
            </Button>
            </Link>
        </div>
      </div>
    </main>
  );
}



