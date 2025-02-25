// server component - remove the 'use client' directive
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { FormInput } from "@/components/input-form";
import Link from "next/link";
import Image from "next/image";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen justify-center p-4">
        <div className="w-full max-w-full">
          <FormMessage message={searchParams} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden rounded-md">
      {/* Left side - Image */}
      <div className="hidden rounded-lg lg:flex lg:w-1/2 bg-gradient-to-b from-violet-50 to-white relative">
        <div className="absolute rounded-md inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="relative w-full rounded-md h-full flex items-center justify-center p-12">
          <Image
            src="/daftar.jpg"
            alt="Registration Illustration"
            width={600}
            height={600}
            className="object-contain max-h-[80vh]"
            priority
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Daftar</h1>
            <p className="text-gray-600 mt-2">
              Silakan daftar untuk mengakses semua fitur
            </p>
          </div>

          {/* Display form message at the top if available */}
          <FormMessage message={searchParams} />

          <form className="w-full flex flex-col gap-6" method="post">
            <div className="space-y-4">
              <FormInput
                name="email"
                label="Email"
                type="email"
                placeholder="contoh@email.com"
                required
                validation={{
                  patternString: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                  message: "Format email tidak valid"
                }}
              />

              <FormInput
                name="displayName"
                label="Nama"
                placeholder="Nama anda"
                required
              />

              <FormInput
                name="password"
                label="Kata Sandi"
                type="password"
                placeholder="Buat kata sandi"
                required
                minLength={6}
              />
            </div>

            <SubmitButton
              formAction={signUpAction}
              pendingText="Mendaftar..."
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-md transition-colors"
            >
              Daftar
            </SubmitButton>

            <p className="text-center text-sm text-gray-600">
              Sudah punya akun?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-violet-600 hover:text-violet-700 underline"
              >
                Masuk
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}