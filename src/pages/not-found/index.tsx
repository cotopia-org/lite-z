import Logo from "@/components/partials/logo";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="h-screen w-screen relative">
      <div className="fixed top-6 right-6">
        <Logo />
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <img
          src="/assets/images/wave.png"
          alt="wave"
          className="w-full h-auto"
        />
      </div>
      <div className="grid grid-cols-12 w-full h-full md:gap-12 px-8">
        <div className="col-span-12 md:col-span-6 flex flex-col h-full justify-center ">
          <img
            src="/assets/laptop-not-found.jpg"
            alt="Laptop Not Found"
            className="max-w-[300px] md:max-w-full xl:max-w-[600px] w-auto mx-auto"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-col md:h-full items-center justify-center gap-y-8 md:items-start">
            <div className="flex flex-col gap-y-2 items-center md:items-start">
              <strong className="font-bold text-8xl text-black/[.87]">
                404
              </strong>
              <span className="text-label font-medium text-xl">
                متأسفانه صفحه مورد نظر یافت نشد
              </span>
            </div>
            <Link
              to={`/`}
              className={buttonVariants({
                variant: "default",
              })}
            >
              بازگشت به پروفایل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
