import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const poppin = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-poppins" }); //Css variables basic iss tarah sa hota hai kay like ab yeh font impoprt krka use kr rhay hain toh isko humna ek variable name assign krdia now we can use this variable anywhere that represents that is the poppins font like e.g: font-family:var(--font-poppins).

export const metadata: Metadata = {
  title: "Evently",
  description: "EventBox is a platform for managing events",
  icons: { //this is actual way to add favicon or app icon, but dont know why its not working.below you will find an alternate in head tag.
    icon: "/assets/images/logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
      <html lang="en">
        <head><link rel="icon" href="\assets\images\logo.svg" sizes="any" ></link></head>{/*this is way to add favicon while working with plain HTML/CSS but right now here its working so thats why i use it.*/}
        <body className={poppin.variable}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
