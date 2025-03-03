"use client";

import { useState } from "react";
import { FormMessage } from "@/components/form-message";
import { FormInput } from "@/components/input-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Signup() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const typeParam = searchParams.get('type');
  // Ensure type is one of the allowed values
  const type = typeParam === "success" ? "success" : "error";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const displayName = (form.elements.namedItem("displayName") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      // Basic validations
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage("Format email tidak valid");
        setIsLoading(false);
        return;
      }

      if (!displayName || displayName.trim().length === 0) {
        setErrorMessage("Nama tidak boleh kosong");
        setIsLoading(false);
        return;
      }

      if (!password || password.length < 6) {
        setErrorMessage("Kata sandi minimal harus 6 karakter");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      
      // Remove all pre-validation of email existence
      // and simply proceed with the signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.log("Signup error:", error);
        // Check for specific error messages that indicate the email is already registered
        if (error.message.includes("already registered") || 
            error.message.includes("already exists") || 
            error.message.includes("already taken") ||
            error.message.includes("User already registered") ||
            error.status === 400) {
          setErrorMessage("Email sudah terdaftar. Silakan gunakan email lain.");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        // Check the response structure for identity confirmation required
        // Supabase returns a specific structure when signup is successful but email confirmation is needed
        const identityConfirmationRequired = 
          data?.user?.identities && data.user.identities.length === 0;
        
        if (identityConfirmationRequired) {
          setErrorMessage("Email sudah terdaftar. Silakan gunakan email lain.");
        } else {
          setSuccessMessage("Terima kasih sudah mendaftar! Silakan cek email untuk verifikasi akun");
          form.reset();
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrorMessage("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden rounded-md">
      {/* Left side - Image */}
      <div className="hidden lg:flex rounded-lg lg:w-1/2 bg-gradient-to-b from-violet-50 to-white relative">
        <div className="absolute rounded-md inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="relative rounded-md w-full h-full flex items-center justify-center p-12">
          <Image
            src="/daftar.jpg"
            alt="Registration Illustration"
            width={600}
            height={600}
            className="object-contain max-h-[80vh] rounded-md"
            priority
          />
        </div>
      </div>
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Daftar</h1>
            <p className="text-gray-600 mt-2">
              Silakan daftar untuk mengakses semua fitur
            </p>
          </div>
          
          {/* Display URL param messages with fixed type */}
          {message && (
            <FormMessage message={{ message, type }} />
          )}
          
          {/* Display client-side validation errors */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
              {errorMessage}
            </div>
          )}

          {/* Display success message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-4">
              {successMessage}
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
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-md transition-colors disabled:bg-violet-400"
            >
              {isLoading ? "Mendaftar..." : "Daftar"}
            </button>
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