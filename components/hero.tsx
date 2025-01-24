import Link from "next/link";
import NextLogo from "./next-logo";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="flex flex-col gap-12 items-center p-3.5">
      <div className="flex gap-8 justify-center items-center">
        <a
          href="https://okocekemanusiaan.org"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/ook.WEBP" alt="OOK LOGO" className="w-20" />
        </a>
        <span className="border-l rotate-45 h-6" />
        <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          <NextLogo />
        </a>
      </div>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Ketahui tingkat stres anda dengan menggunakan {" "}
        <span className="font-bold">
          Soulution Stress Checker
        </span>
      </p>
      <div className="flex gap-3">
        <Link href={"/protected"}>
      <Button> Cek Sekarang </Button>
        </Link>
      <Button
      variant={"outline"}>
         Pelajari Metode 
      </Button>
      </div>
    </div>
  );
}
