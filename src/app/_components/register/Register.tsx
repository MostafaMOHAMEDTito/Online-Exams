"use client";

import { FormEvent, useState } from "react";
import Joi from "joi";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Joi schema for validation
  const schema = Joi.object({
    firstName: Joi.string().min(2).required().messages({
      "string.empty": "First Name is required",
      "string.min": "First Name must be at least 2 characters",
    }),
    lastName: Joi.string().min(2).required().messages({
      "string.empty": "Last Name is required",
      "string.min": "Last Name must be at least 2 characters",
    }),
    username: Joi.string().min(3).required().messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters",
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Enter a valid email address",
      }),
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base":
          "Password must include uppercase, lowercase, number, and special character",
      }),
    rePassword: Joi.any().valid(Joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
    }),
    phone: Joi.string()
      .pattern(/^01[0-2,5]{1}[0-9]{8}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Enter a valid phone number (01023456789)",
      }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Validate field on change
    const fieldSchema = schema.extract(name); // Extract the schema for the specific field
    const { error } = fieldSchema.validate(value);
    if (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error.details[0].message,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [name]: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading state
    try {
      // Validate form data
      const { error } = schema.validate(formData, { abortEarly: false });
      if (error) {
        const validationErrors: Record<string, string> = {};
        error.details.forEach((detail) => {
          validationErrors[detail.path[0] as string] = detail.message;
        });
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      setErrors({}); // Clear previous errors

      // Make API request
      const res = await fetch(
        "https://exam.elevateegy.com/api/v1/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        // Check for server-provided error message
        const errorMessage =
          result?.message || "Signup failed. Please try again.";
        setErrors({ general: errorMessage });
        setIsSubmitting(false);
        return;
      }

      console.log("Signup successful!", { user: result });
      setIsSubmitting(false);

      // Redirect to login page after successful signup

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrors({
        general: "An unexpected error occurred. Please try again later.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-full">
      <form onSubmit={handleSubmit} className="w-[35%] flex flex-col gap-6">
        <p className="font-bold text-xl text-gray-800 ">Create Account</p>

        {/* First Name */}
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={`w-full shadow-lg border-2 p-2 rounded-lg focus-visible:outline ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 ${
              errors.firstName
                ? "focus:ring-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={`w-full shadow-lg border-2 p-2 rounded-lg focus-visible:outline ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 ${
              errors.lastName
                ? "focus:ring-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={`w-full shadow-lg border-2 p-2 rounded-lg focus-visible:outline ${
              errors.username ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 ${
              errors.username
                ? "focus:ring-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={`w-full shadow-lg border-2 p-2 rounded-lg focus-visible:outline ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 ${
              errors.email
                ? "focus:ring-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`w-full shadow-lg border-2 p-2 rounded-lg focus-visible:outline ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 ${
              errors.password
                ? "focus:ring-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            name="rePassword"
            placeholder="Confirm Password"
            className={`w-full shadow-lg border-2 p-2 rounded-lg focus-visible:outline ${
              errors.rePassword ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 ${
              errors.rePassword
                ? "focus:ring-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            value={formData.rePassword}
            onChange={handleChange}
          />
          {errors.rePassword && (
            <p className="text-red-500 text-sm mt-1">{errors.rePassword}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className={`w-full shadow-lg border-2 p-2 rounded-lg focus-visible:outline ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 ${
              errors.phone
                ? "focus:ring-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* General error */}
        {errors.general && (
          <p className="text-red-500 text-sm mt-1">{errors.general}</p>
        )}

        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}
