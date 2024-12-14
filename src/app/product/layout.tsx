import React from "react";
import Dashboard from "../_components/Dashboard/page";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section className="relative">
        <Dashboard />
        <div className="p-4 sm:ml-64">{children}</div>
      </section>
    </>
  );
}
