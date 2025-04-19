import { SignInButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";


export default function LandingPage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-stone-500 text-white">
      <img
        src="/images/logo.png"
        alt="Logo Watermark"
        className="absolute z-0 w-2/3 opacity-10 pointer-events-none"
      />

      <div className="z-10 flex flex-col items-center">
        <div className="mb-6 flex space-x-8">
          <SignInButton forceRedirectUrl={"/drive"}>
            <Button className="flex items-center justify-center px-6 py-2 rounded-md font-medium transition-all duration-200 bg-gray-100 hover:bg-white text-gray-800 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md hover:scale-105 active:bg-gray-300 active:shadow-inner">
              Sign-in/Sign-up
            </Button>
          </SignInButton>
        </div>
      </div>
    </main>
  );
}
