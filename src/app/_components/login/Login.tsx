"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Joi from "joi";
import Link from "next/link";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate the form data
    const validationResult = schema.validate(formData, { abortEarly: false });

    if (validationResult.error) {
      // Collect validation errors
      const validationErrors: Record<string, string> = {};
      validationResult.error.details.forEach((detail) => {
        validationErrors[detail.path[0] as string] = detail.message;
      });
      setErrors(validationErrors);
      return;
    }

    setErrors({}); 

    try {
      // Attempt to sign in
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/",
      });

      if (result?.error) {
        setErrors({ form: result.error });
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

        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

        <Link
          href={"/forgotPassword"}
          className="text-xs text-[#122D9C] text-end cursor-pointer hover:underline"
        >
          Recover Password?
        </Link>
        <button
          type="submit"
          className="bg-[#4461F2] text-white font-light text-sm w-full p-3 rounded-2xl hover:bg-[#3653c2]"
        >
          Sign in
        </button>
      </form>

      <div className="flex gap-3 items-center">
        <div className="divider h-[1px] bg-[#E7E7E7] w-12"></div>
        <p>or Continue with</p>
        <div className="divider h-[1px] bg-[#E7E7E7] w-12"></div>
      </div>

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
