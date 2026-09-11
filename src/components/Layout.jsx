import React from "react";
import Navbar from "@/components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-owl-beige flex flex-col">
      <Navbar />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}