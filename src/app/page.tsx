"use client";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-stone-500 text-white">
      <img
        src="/images/logo.png"
        alt="Logo Watermark"
        className="absolute z-0 w-2/3 opacity-10"
      />
      <h1 className="z-10 mb-6 text-5xl font-bold">Welcome to CloudSync</h1>
      <p className="z-10 mb-6 text-lg">Your personal cloud storage solution</p>
      <div className="mb-6 flex space-x-8">
        <button
          onClick={() => router.push("/login")}
          className="z-10 rounded-md bg-stone-50 px-8 py-3 text-lg font-semibold text-stone-700 transition hover:bg-stone-500 hover:text-white"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="z-10 rounded-md bg-stone-50 px-6 py-3 text-lg font-semibold text-stone-700 transition hover:bg-stone-500 hover:text-white"
        >
          Sign Up
        </button>
      </div>
    </main>
  );
}
