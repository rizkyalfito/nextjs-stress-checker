"use client";

import { FormInput } from "@/components/input-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Modified FormMessage component without close button
const FormMessage = ({ message }: { message: { message: string; type: "error" | "success" } }) => {
  return (
    <div className={`p-4 mb-6 rounded-md ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
      <p>{message.message}</p>
    </div>
  );
};

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{message: string, type: "error" | "success"} | null>(null);
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const type = searchParams.get('type') || "error";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setStatusMessage({
          message: "Format email tidak valid",
          type: "error"
        });
        setIsSubmitting(false);
        return;
      }
      
      const supabase = createClient();
      // Get the complete, absolute URL for the redirect
      const origin = window.location.origin;
      
      // Make sure redirectTo has the full, absolute URL
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
        setStatusMessage({
          message: "Tidak dapat mengatur ulang kata sandi. Silakan coba lagi.",
          type: "error"
        });
      } else {
        setStatusMessage({
          message: "Link reset password telah dikirim ke email Anda",
          type: "success"
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setStatusMessage({
        message: "Gagal mengirim email reset password. Silakan coba lagi.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Form (now full width) */}
      <div className="w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Reset Kata Sandi</h1>
            <p className="text-gray-600 mt-2">
              Masukkan email Anda untuk menerima link reset kata sandi
            </p>
          </div>
          
          {/* Display message from URL params if available */}
          {message && !statusMessage && (
            <FormMessage message={{ message, type: type as "error" | "success" }} />
          )}
          
          {/* Display client-side message if available */}
          {statusMessage && (
            <FormMessage message={statusMessage} />
          )}
          
          <form 
            className="w-full flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
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
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-md transition-colors disabled:bg-violet-400"
            >
              {isSubmitting ? "Memproses..." : "Atur Ulang Sandi"}
            </button>
            <p className="text-center text-sm text-gray-600">
              Sudah ingat kata sandi?{" "}
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