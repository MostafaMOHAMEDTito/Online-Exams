import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";

// Define Subject interface
interface Subject {
  _id: string;
  icon?: string;
  name?: string;
}

// Fetch subjects
async function fetchSubjects(token: string): Promise<Subject[]> {
  try {
    const response = await fetch(
      "https://exam.elevateegy.com/api/v1/subjects",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch subjects: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data.subjects || [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return []; // Return empty array on failure
  }
}

export default async function Quiez() {
  // Get session details
  const session: any = await getServerSession(OPTIONS);

  if (!session?.token) {
    console.error("No token found in session.");
    return (
      <section>
        <p className="text-center text-gray-500">Please log in to view quizzes.</p>
      </section>
    );
  }

  // Fetch subjects using the session token
  const subjects = await fetchSubjects(session.token);

  return (
    <section>
      <div className="w-5/6 m-auto">
        <h3 className="font-bold text-[#4461f2]">Quizzes</h3>
      </div>
      <div className="w-5/6 m-auto flex flex-wrap justify-center items-center">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <div key={subject._id} className="w-4/12 p-4">
              <Image
                width={400}
                height={400}
                src={subject.icon || "/placeholder.jpg"} 
                alt={subject.name || "No Title"}
                className="w-full h-auto"
              />
              <div className="bg-[#2d85d7]">
                <h2 className="text-center text-lg font-bold mt-2 text-white">
                  {subject.name || "Untitled"}
                </h2>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No subjects found.</p>
        )}
      </div>
    </section>
  );
}
