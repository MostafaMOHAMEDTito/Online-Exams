import Link from "next/link";
import React from "react";

const RenderInCorrectQuestions = ({
  questions,
  answers,
}: {
  questions: any[];
  answers: string[];
}) => {
  return (
    <div
      className={
        questions.length === 0
          ? "hidden"
          : "bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto z-50 flex flex-wrap justify-center items-center gap-6 box-border"
      }
    >
      {questions.map((question, index) => (
        <div
          key={question._id}
          className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50 w-5/12"
        >
          <h4 className="text-lg font-semibold mb-3 text-gray-800">
            {question?.question}
          </h4>
          <ul className="space-y-2">
            {question?.answers.map(
              (
                option: { answer: string; key: string }, // Correctly destructuring option
                i: number
              ) => {
                // Determine if this option is the correct answer
                const isCorrect = question.correct === option.key;
                // Determine if this option is the user's selected answer
                const isSelected = answers[index] === option.key;

                // Add CSS classes based on correctness and selection
                const answerClass = isCorrect
                  ? "bg-green-100 text-green-800 border-green-300"
                  : isSelected
                  ? "bg-red-100 text-red-800 border-red-300"
                  : "bg-gray-100 text-gray-800 border-gray-300";

                return (
                  <li
                    key={i}
                    className={`p-3 rounded-lg border ${answerClass} flex items-center`}
                  >
                    {isCorrect && (
                      <span className="mr-2 text-green-600 font-bold">✔</span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="mr-2 text-red-600 font-bold">✘</span>
                    )}
                    <span>{option.answer}</span>{" "}
                    {/* Render the `answer` property */}
                  </li>
                );
              }
            )}
          </ul>
        </div>
      ))}
      <Link href={"/"} 
      className="w-5/12">
        <button className=" w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
          Close
        </button>
      </Link>
    </div>
  );
};

export default RenderInCorrectQuestions;
