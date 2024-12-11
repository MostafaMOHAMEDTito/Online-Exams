import { getServerSession } from "next-auth";
import React from "react";
import Image from "next/image";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";

// Fetch session and data
export default async function Quiez() {
  // Check for user session
  const session: any = await getServerSession(OPTIONS);

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

  return (
    <section>
      <div className="w-5/6 m-auto">
        <h3 className=" font-bold text-[#4461f2] ">Quizes</h3>
      </div>
      <div className="w-5/6 m-auto flex flex-wrap justify-center items-center">
        {subjects?.length > 0 ? (
          subjects.map((subject: any) => (
            <div key={subject._id} className="w-4/12 p-4">
              <Image
                width={400}
                height={400}
                src={subject.icon || "/placeholder.jpg"} // Fallback image
                alt={subject.title || "No Title"}
                className="w-full h-auto"
              />
              <div className=" bg-[#2d85d7]">
            
                <h2 className="text-center text-lg font-bold mt-2 text-white  ">
                  {subject.name || "Untitled"}
                </h2>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>
    </section>
  );
}
