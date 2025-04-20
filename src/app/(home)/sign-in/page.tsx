"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react"; 

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError("");
    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });
  
      if (result.status === "complete") {
        router.push("/drive");
      } else {
        console.log("Additional steps required:", result);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Login failed.");
    }
  };
  

  const handleGoogleSignIn = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/drive",
      });
    } catch (err) {
      setError(err.errors?.[0]?.message || "Google sign-in failed.");
    }
  };


  return (
    <main className="flex flex-col items-center justify-center bg-stone-100">
      {/* Logo */}
      <Link href="/" passHref>
        <img
          src="/images/logo.png"
          alt="Logo"
          className="absolute left-6 top-6 h-auto w-16 cursor-pointer transition hover:opacity-60"
        />
      </Link>
      
      <div className="w-96 rounded-md z-1 opacity-100 bg-stone-200 p-8 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Login</h2>
        {error && <p className="text-center text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border p-3"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border p-3 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full rounded-md bg-stone-600 py-3 font-semibold text-white transition hover:bg-stone-700"
        >
          Login
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="mt-4 w-full rounded-md bg-stone-400 py-3 font-semibold text-white transition hover:bg-stone-500 flex items-center justify-center space-x-2"
        >
          <img
            src="/images/GoogleLogo.png"
            alt="Google Logo"
            className="h-6 w-6"
          />
          <span>Sign in with Google</span>
        </button>
        {/* <button
          onClick={() => router.push("/sign-up")}
          className="mt-4 w-full rounded-md bg-stone-400 py-3 font-semibold text-white transition hover:bg-stone-500"
        >
          Don't have an account? Sign Up
        </button> */}
      </div>
    </main>
  );
}
