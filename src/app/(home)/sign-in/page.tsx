import { SignInButton } from "@clerk/nextjs";


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
          <SignInButton forceRedirectUrl={"/drive"} />
        </div>
      </div>
    </main>
  );
}
