"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Dummy signup process (no backend)
    alert("Account created successfully!");
    router.push("/main"); // Redirect to main page
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-100">
      <Link href="/" passHref>
        <img
          src="/images/logo.png"
          alt="Logo"
          className="absolute left-6 top-6 h-auto w-16 cursor-pointer transition hover:opacity-60"
        />
      </Link>
      <div className="w-96 rounded-md bg-stone-200 p-8 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Sign Up</h2>
        {error && <p className="text-center text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-md border p-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 w-full rounded-md border p-3"
        />

        <button
          onClick={handleSignup}
          className="w-full rounded-md bg-stone-600 py-3 font-semibold text-white transition hover:bg-stone-700"
        >
          Sign Up
        </button>

        <button
          onClick={() => router.push("/login")}
          className="mt-4 w-full rounded-md bg-stone-400 py-3 font-semibold text-white transition hover:bg-stone-500"
        >
          Already have an account? Login
        </button>
      </div>
    </main>
  );
}
