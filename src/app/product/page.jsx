import { getServerSession } from "next-auth";
import React from "react";
import { OPTIONS } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Image from "next/image";

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array as fallback
  }
}

export default async function Product() {
  // Check for user session
  const session = await getServerSession(OPTIONS);

  if (!session) {
    redirect("/api/auth/signin");
    return null; // Ensure no further rendering happens
  }

  // Fetch product data
  const productsData = await fetchProducts();

  return (
    <section>
      <div className="w-3/4 m-auto flex flex-wrap justify-center items-center">
        {productsData.length > 0 ? (
          productsData.map((product) => (
            <div key={product.id} className="w-3/12 p-4">
              <Image
                width={200}
                height={200}
                src={product.image}
                alt={product.title}
                className="w-full h-auto"
              />
              <h2 className="text-center text-lg font-bold mt-2">
                {product.title}
              </h2>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>
    </section>
  );
}
