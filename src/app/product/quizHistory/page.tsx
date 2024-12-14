"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import CSS from "../../../../public/CSS.png";
import JS from "../../../../public/JS.png";
import HTML from "../../../../public/HTML.png";
import ReactImg from "../../../../public/React.png";
import Swal from "sweetalert2";
import StartQuiz from "../startQuiz/page";
import LoadingSpinner from "@/app/_components/loadingSpinner/page";

// Map images to quiz titles
const renderImg: any = {
  "JavaScript Quiz": JS,
  "CSS Quiz": CSS,
  "HTML Quiz": HTML,
  "React Quiz": ReactImg,
};
export default function QuizHistory() {
  const [quizzes, setQuizzes] = useState<any[]>([]); // Store quizzes
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [token, setToken] = useState<string | null>(null); // Store token
  const [display, setdisPlay] = useState("hidden "); //change display

  // Fetch token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);
  //function startQuizzes
  function startQuizzes() {
    // Logic to start quizzes
    Swal.fire({
      title: "instructions",
      icon: "question",
      cancelButtonColor: "#4461F2",
      confirmButtonText: "Start",
      html: `
      <ul>
  <li>Duration: 20 minutes.</li>
  <li>Questions: 25.</li>
  <li>Don't leave the page.</li>
  <li>Don't leave the page.</li>
</ul>
`,
    }).then((result) => {
      if (result.isConfirmed) {
        //show question
        setdisPlay("flex ");
      }
    });
  }

  // Fetch quizzes data
  useEffect(() => {
    async function fetchQuizzes() {
      if (!token) return;
      try {
        const response = await fetch(
          "https://exam.elevateegy.com/api/v1/exams",
          {
            headers: {
              "Content-Type": "application/json",
              token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuizzes(data?.exams || []); // Assuming `exams` is the key in the response
      } catch (err: any) {
        setError(err.message || "Failed to fetch quizzes.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuizzes();
  }, [token]);

  // Render Loading State
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render Error State
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  // Render Empty State
  if (quizzes.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg font-semibold">No quizzes found.</p>
      </div>
    );
  }

  // Render Quizzes
  return (
    <section className="w-5/6 mx-auto ">
      <h3 className="text-[#4461F2] font-bold text-3xl mb-8 ">Quiz History</h3>
      <div className="grid grid-cols-1  gap-8">
        {quizzes.map(
          (quiz: {
            _id: string;
            title: string;
            duration: number;
            numberOfQuestions: number;
            createdAt: string;
          }) => (
            <div
              key={quiz._id}
              className=" flex flex-wrap justify-between items-center bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Placeholder image for quizzes */}
              <div className="  flex items-center justify-center rounded-t-lg">
                <Image
                  src={renderImg[quiz.title] || "/placeholder.jpg"}
                  alt={quiz.title}
                  width={100}
                  height={100}
                  className=""
                />
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-semibold">Questions:</span>{" "}
                  {quiz.numberOfQuestions}
                </p>
              </div>

              {/* Quiz Details */}
              <div className="p-4">
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {quiz.title}
                </h4>
                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-semibold">Duration:</span>{" "}
                  {quiz.duration} minutes
                </p>
              </div>

              {/* Action Button */}
              <div className="px-4 py-6 ">
                <button
                  onClick={startQuizzes}
                  className="bg-[#4461F2] text-white text-sm py-3 px-4 rounded-lg hover:bg-[#4461F2] transition-colors duration-200"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          )
        )}
      </div>
      <div
        className={`${display} w-full  flex-wrap justify-center items-center justify-items-center bg-gray-200/70 h-screen absolute top-0 right-0 `}
      >
        <div>
          <StartQuiz />
        </div>
      </div>
    </section>
  );
}
