import { getServerSession } from "next-auth";
import React from "react";
import { OPTIONS } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Quiez from "../_components/quiez/page";
import Dashboard from "../_components/dashboard/page";

// Fetch session and data
export default async function Product() {
  // Check for user session
  const session: any = await getServerSession(OPTIONS);

  if (!session) {
    redirect("/api/auth/signin");
    return null; // Prevent further rendering
  }

  // Fetch product data
  async function fetchSubjects() {
    try {
      const response = await fetch(
        "https://exam.elevateegy.com/api/v1/subjects",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: session?.token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return []; // Return fallback empty array
    }
  }
  // Fetch subjects
  const { subjects } = await fetchSubjects();

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
