"use client";

import { useState } from "react";
import { FormMessage } from "@/components/form-message";
import { FormInput } from "@/components/input-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      // Validasi email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage("Format email tidak valid");
        setIsLoading(false);
        return;
      }

      // Validasi password (minimal tidak boleh kosong)
      if (!password || password.trim().length === 0) {
        setErrorMessage("Kata sandi tidak boleh kosong");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage("Email atau password salah!");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden rounded-md">
      {/* Left side - Image */}
      <div className="hidden lg:flex rounded-lg lg:w-1/2 bg-gradient-to-b from-violet-50 to-white relative">
        <div className="absolute rounded-md inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),
        linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="relative rounded-md w-full h-full flex items-center justify-center p-12">
          <Image
            src="/masuk.jpg"
            alt="Login Illustration"
            width={600}
            height={600}
            className="object-contain max-h-[80vh] rounded-md"
            priority
          />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Masuk</h1>
            <p className="text-gray-600 mt-2">
              Silakan masuk untuk mengakses semua fitur
            </p>
          </div>
          {message && (
            <FormMessage message={{ message, type: "error" }} />
          )}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
              {errorMessage}
            </div>
          )}
          
          <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
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
              <div className="space-y-1">
                <div className="relative">
                  <FormInput
                    name="password"
                    label="Kata Sandi"
                    type={showPassword ? "text" : "password"}
                    placeholder="Kata sandi anda"
                    required
                    minLength={6}
                  />
                  <button 
                    type="button"
                    className="absolute right-0 top-9 -mr-8 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {/* <Link
                  href="/forgot-password"
                  className="text-sm text-violet-600 hover:text-violet-700 underline block text-right mt-2"
                >
                  Lupa Password?
                </Link> */}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-md transition-colors disabled:bg-violet-400"
            >
              {isLoading ? "Masuk..." : "Masuk"}
            </button>
            <p className="text-center text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-violet-600 hover:text-violet-700 underline"
              >
                Daftar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}