"use client";
import LoginForm from "@/components/login/Login";
import RegisterForm from "@/components/register/Register";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Signin() {
  return (
    <div className="login grid grid-cols-3 gap-8  space-y-10 h-screen">
      <div className="wlcome-elevate flex h-full flex-col justify-center  bg-[#F0F4FC] col-span-1 py-8 px-8 shadow-lg rounded-tr-[100px] rounded-br-[100px]">
        <h1 className="text-5xl font-semibold leading-tight">
          Welcome to{" "}
          <span className="block text-[#122D9C] leading-loose">Elevate</span>
        </h1>
        <p className="text-lg font-normal ">
          Quidem autem voluptatibus qui quaerat aspernatur architecto natus
        </p>
        <Image width={308} height={308} src={"/bro.png"} alt="elevate" />
      </div>
      <div className="form col-span-2 px-10">
        <div className="links flex gap-6 justify-end">
          <Link
            href={"/login"}
            className="text-[#122D9C] font-medium cursor-pointer"
          >
            Sign in
          </Link>
          <Link
            href={"/register"}
            className="border px-4  font-light text-[#122D9C] rounded-xl cursor-pointer"
          >
            Sign up
          </Link>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
