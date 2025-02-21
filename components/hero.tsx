import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative w-full bg-gradient-to-b from-violet-50 to-white min-w-full rounded-md">
      <div className="absolute inset-0 min-w-full">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>
      <div className="relative py-24 mx-auto max-w-full min-w-full">
        <div className="flex flex-col items-center gap-12 pb-7">
          <div className="flex items-center justify-center gap-4 ">
            <a
              href="https://okocekemanusiaan.org"
              target="_blank"
              rel="noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img src="/ook.WEBP" alt="OOK LOGO" className="w-20" />            
              </a>
            <span className="h-6 rotate-45 border-l border-gray-300" />
            <a
              href="https://okoce.net/"
              target="_blank"
              rel="noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img src="/ooi.png" alt="OOK LOGO" className="w-24" />
            </a>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-2xl font-normal text-gray-900 lg:text-4xl !leading-tight">
              Ketahui tingkat stres anda dengan menggunakan{" "}
              <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Soulution Stress Checker
              </span>
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/protected">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2">
                Cek Sekarang
              </Button>
            </Link>
            <Link href="#pss-info">
              <Button variant="outline" className="scroll-smooth border-violet-200 text-violet-600 hover:bg-violet-50 px-6 py-2">
                Pelajari Metode
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
