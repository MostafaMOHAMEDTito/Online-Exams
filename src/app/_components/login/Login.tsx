"use client";

import Image from "next/image";
import { useState, FormEvent, ChangeEvent } from "react";
import { signIn } from "next-auth/react";
import Joi from "joi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  // Joi schema for validation
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
      }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate the form data
    const validationResult = schema.validate(formData, { abortEarly: false });

    if (validationResult.error) {
      const validationErrors: FormErrors = {};
      validationResult.error.details.forEach((detail) => {
        validationErrors[detail.path[0] as keyof FormErrors] = detail.message;
      });
      setErrors(validationErrors);
      return;
    }

    // Clear errors on successful validation
    setErrors({});

    try {
      const res = await fetch(
        "https://exam.elevateegy.com/api/v1/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setErrors({ form: result?.message || "Invalid email or password." });
        return;
      }

      // Save the token in local storage
      localStorage.setItem("token", result.token);

      // Display success notification
      Swal.fire({
        icon: "success",
        title: "Login successful",
        text: "Redirecting...",
        timer: 1000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      console.error("API request error:", error);
      setErrors({ form: "An unexpected error occurred. Please try again." });
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen bg-gray-50">
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-6 bg-white shadow-lg rounded-lg p-6"
      >
        <h2 className="font-semibold text-xl text-center text-gray-700">
          Sign In
        </h2>

        {/* Email Input */}
        <input
          type="email"
          name="email"
          className={`w-full border p-3 rounded-lg focus:outline-none ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        {/* Password Input */}
        <input
          type="password"
          name="password"
          className={`w-full border p-3 rounded-lg focus:outline-none ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        {/* Form Error */}
        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

        {/* Recover Password Link */}
        <Link
          href={"/forgotPassword"}
          className="text-sm text-blue-600 text-right hover:underline"
        >
          Recover Password?
        </Link>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium text-lg py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Sign in
        </button>
      </form>

      {/* Divider */}
      <div className="flex gap-3 items-center">
        <div className="h-[1px] bg-gray-300 w-12"></div>
        <p className="text-gray-500">or Continue with</p>
        <div className="h-[1px] bg-gray-300 w-12"></div>
      </div>

      {/* Social Login */}
      <div className="flex gap-4">
        <div
          onClick={() => signIn("github", { callbackUrl: "/product" })}
          className="flex justify-center hover:shadow-lg items-center border p-2 shadow-md rounded-lg cursor-pointer"
        >
          <Image width={20} height={20} alt="github" src={"/download.png"} />
        </div>
        <div
          onClick={() => signIn("google", { callbackUrl: "/product" })}
          className="flex justify-center hover:shadow-lg items-center border p-2 shadow-md rounded-lg cursor-pointer"
        >
          <Image width={20} height={20} alt="google" src={"/Logo Google.png"} />
        </div>
        <div
          onClick={() => signIn("facebook", { callbackUrl: "/product" })}
          className="flex justify-center hover:shadow-lg items-center border p-2 shadow-md rounded-lg cursor-pointer"
        >
          <Image width={20} height={20} alt="facebook" src={"/Vector.png"} />
        </div>
      </div>
    </div>
  );
}
