
import React from "react";
export default function LandingPage(props: {children:React.ReactNode}) {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-stone-500 text-white">
      <img
        src="/images/logo.png"
        alt="Logo Watermark"
        className="absolute z-0 w-2/3 opacity-10 pointer-events-none"
      />
      {props.children}
    </main>
  );
}
