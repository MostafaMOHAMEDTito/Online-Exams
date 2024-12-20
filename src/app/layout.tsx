"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import AuthProvider from "@/context/authProvider";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
    className="scrollbar scrollbar-track-slate-500 scrollbar-thumb-black scrollbar-corner-gray-50">
      <AuthProvider >
      <Provider store={store}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </Provider>
      </AuthProvider>
    </html>
  );
}
