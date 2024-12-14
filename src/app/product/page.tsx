import React from "react";

import Quiez from "../_components/Quiez/page";
import Dashboard from "../_components/Dashboard/page";

// Fetch session and data
export default async function Product() {

  // UI rendering
  return (
    <section>
      <Dashboard />
      <div className="p-4 sm:ml-64">
        <Quiez />
      </div>
    </section>
  );
}
