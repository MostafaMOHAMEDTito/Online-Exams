import React from "react";

import Quiez from "../_components/Quiez/page";
import Dashboard from "../_components/Dashboard/page";


export default async function Product() {

  // UI rendering
  return (
      <section className="relative">
        <Dashboard />
        <div className="p-4 sm:ml-64">
          <Quiez />
        </div>
      </section>
  );
}
