"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Swal from "sweetalert2";

export default function Dashboard() {
  const router = useRouter();

  // Redirect to login if no token is found
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Logout Confirmation
  function logout() {
    Swal.fire({
      title: "Are you sure you want to log out?",
      text: "You will need to log in again to access your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  }

  // Handle Logout Function
  async function handleLogout() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Send API request with token in headers
      const res = await fetch(
        "https://exam.elevateegy.com/api/v1/auth/logout",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Logout failed: ${res.statusText}`);
      }

      // Clear the token and redirect to login
      localStorage.removeItem("token");
      Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      Swal.fire({
        title: "Logout Failed",
        text: "There was an error logging out. Please try again.",
        icon: "error",
      });
    }
  }

  // Sidebar Menu Item Click Handler
  function handleNavigation(path: string) {
    router.push(path);
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <a href="/" className="flex items-center ps-2.5 mb-5">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-[#414448] dark:text-white">
              ELEVATE
            </span>
          </a>
          <ul className="space-y-2 font-medium">
            {/* Dashboard */}
            <li>
              <button
                onClick={() => handleNavigation("/")}
                className="flex items-center p-2 text-[#7B8089] rounded-lg dark:text-white hover:bg-[#4461f2] hover:text-white dark:hover:bg-gray-700 group"
              >
                <span className="ms-3">Dashboard</span>
              </button>
            </li>

            {/* Quiz History */}
            <li>
              <button
                onClick={() => handleNavigation("/product/quizHistory")}
                className="flex items-center p-2 text-[#7B8089] rounded-lg dark:text-white hover:bg-[#4461f2] hover:text-white dark:hover:bg-gray-700 group"
              >
                <span className="ms-3">Quiz History</span>
              </button>
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={logout}
                className="flex items-center p-2 text-[#7B8089] rounded-lg dark:text-white hover:bg-[#4461f2] hover:text-white dark:hover:bg-gray-700 group"
              >
                <span className="ms-3">Log Out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
