
import React from "react";
export default function LandingPage(props: {children:React.ReactNode}) {

  return (
    <main className="flex min-h-screen h-full flex-col items-center justify-center bg-stone-100">
      <img
        src="/images/logo.png"
        alt="Logo Watermark"
        className="absolute z-0 w-2/3 opacity-5 pointer-events-none"
      />
      {props.children}
    </main>
  );
}
