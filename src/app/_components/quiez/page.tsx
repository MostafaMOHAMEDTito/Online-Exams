"use client";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { getAllSubjects } from "@/lib/subjectsSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "../loadingSpinner/page";

export default function Quiez() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // State to store token
  const [token, setToken] = useState<string | null>(null);


  // Fetch the token from localStorage 
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    } else {
      router.push("/login");
    }
  }, []);

  // Select subjects state from Redux
  const { subjects, isLoading, isError, error } = useSelector(
    (state: RootState) => state.subjects
  );

  // Fetch subjects when token is available
  useEffect(() => {
    if (token) {
      dispatch(getAllSubjects());
    }
  }, [dispatch, token]);

  // Conditional Rendering for Loading, Error, and Content States
  if (isLoading || subjects.length === 0 || !token) {
    return (
      <LoadingSpinner/>
    );
  }

  if (isError || !subjects || !Array.isArray(subjects)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg font-semibold">
          {error || "Failed to load subjects."}
        </p>
      </div>
    );
  }

  // Render subjects
  return (
    <section className="w-5/6 mx-auto">
      <h3 className="text-maincolor font-bold text-2xl mb-6 ">Quizzes</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {subjects.map(
          (subject: { _id: string; name: string; icon?: string }) => (
            <Link
              href={"/product/quizHistory"}
              key={subject._id}
              className="relative sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)] box-border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
            >
              <Image
                width={400}
                height={400}
                src={subject.icon || "/placeholder.jpg"}
                alt={subject.name || "No Title"}
                className="w-full h-auto rounded-t-lg object-cover"
              />
              <div className="bg-blue-400/45 p-3 rounded-b-lg absolute top-3/4 inset-x-5 w-3/4 flex items-center justify-center">
                <h2 className="text-white text-center text-lg font-bold">
                  {subject.name || "Untitled"}
                </h2>
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
