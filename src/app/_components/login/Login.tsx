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
      // Attempt to sign in
      const result: any = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/",
        redirect: false, // Prevent automatic redirection to handle errors
      });

      if (result?.error) {
        setErrors({ form: result.error });
      } else if (result?.ok && result?.url) {
        Swal.fire({
          title: "Welcome",
          text: "welcome in online exams!",
          icon: "success",
        });

        setTimeout(() => {
          router.push(result.url);
        }, 1000); // Use the provided callback URL
      } else {
        setErrors({ form: "Unexpected error. Please try again." });
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setErrors({ form: "An unexpected error occurred. Please try again." });
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-full">
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="w-[35%] flex flex-col gap-6"
      >
        <p className="font-semibold text-lg">Sign in</p>

        {/* Email Input */}
        <input
          type="email"
          name="email"
          className={`w-full shadow-lg border-2 p-2 rounded-lg focus-visible:outline ${
            errors.email ? "border-red-500" : ""
          }`}
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        {/* Password Input */}
        <input
          type="password"
          name="password"
          className={`w-full shadow-lg border-2 p-2 rounded-lg focus-visible:outline ${
            errors.password ? "border-red-500" : ""
          }`}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="off"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        {/* Form Error */}
        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

        {/* Recover Password Link */}
        <Link
          href={"/forgotPassword"}
          className="text-xs text-[#122D9C] text-end cursor-pointer hover:underline"
        >
          Recover Password?
        </Link>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#4461F2] text-white font-light text-sm w-full p-3 rounded-2xl hover:bg-[#3653c2]"
        >
          Sign in
        </button>
      </form>

      {/* Divider */}
      <div className="flex gap-3 items-center">
        <div className="divider h-[1px] bg-[#E7E7E7] w-12"></div>
        <p>or Continue with</p>
        <div className="divider h-[1px] bg-[#E7E7E7] w-12"></div>
      </div>

      {/* Social Login */}
      <div className="social-login flex gap-4">
        <div
          onClick={() => signIn("github", { callbackUrl: "/product" })}
          className="login-item flex justify-center hover:shadow-lg items-center border p-2 shadow-md rounded-lg cursor-pointer"
        >
          <Image width={20} height={20} alt="github" src={"/download.png"} />
        </div>
        <div
          onClick={() => signIn("google", { callbackUrl: "/product" })}
          className="login-item flex justify-center hover:shadow-lg items-center border p-2 shadow-md rounded-lg cursor-pointer"
        >
          <Image width={20} height={20} alt="google" src={"/Logo Google.png"} />
        </div>
        <div
          onClick={() => signIn("facebook", { callbackUrl: "/product" })}
          className="login-item flex justify-center hover:shadow-lg items-center border p-2 shadow-md rounded-lg cursor-pointer"
        >
          <Image width={20} height={20} alt="facebook" src={"/Vector.png"} />
        </div>
      </div>
    </div>
  );
}
