// FormMessage.tsx
"use client";

import React from "react";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type Message = {
  type?: "success" | "error";
  message?: string;
  [key: string]: any;
};

const messageVariants = cva(
  "flex items-center gap-3 p-4 rounded-lg mb-6 text-sm transition-all animate-in fade-in-50 duration-300",
  {
    variants: {
      variant: {
        success: "bg-green-50 border border-green-200 text-green-700",
        error: "bg-red-50 border border-red-200 text-red-700",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  }
);

export interface FormMessageProps extends VariantProps<typeof messageVariants> {
  message: Message;
  className?: string;
}

export const FormMessage = ({
  message,
  className,
  ...props
}: FormMessageProps) => {
  if (!message || !message.message) {
    return null;
  }

  // Map common error messages to more user-friendly versions
  const getUserFriendlyErrorMessage = (errorMessage: string) => {
    const errorMap: Record<string, string> = {
      "Email and password are required": "Email dan kata sandi diperlukan untuk mendaftar",
      "Invalid login credentials": "Email atau kata sandi yang Anda masukkan salah",
      "Email already registered": "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda",
      "Password should be at least 6 characters": "Kata sandi harus memiliki minimal 6 karakter",
      "User not found": "Pengguna tidak ditemukan. Periksa email Anda atau daftar terlebih dahulu",
      "Email not confirmed": "Email belum dikonfirmasi. Silakan cek kotak masuk email Anda"
    };

    return errorMap[errorMessage] || errorMessage;
  };

  const displayMessage = getUserFriendlyErrorMessage(message.message);
  const isError = message.type === "error";
  const isSuccess = message.type === "success";

  return (
    <div
      className={cn(
        messageVariants({ variant: isSuccess ? "success" : "error" }),
        className
      )}
      {...props}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <AlertCircle className="h-5 w-5" />
      )}
      
      <div className="flex-1">
        <div className="font-medium">
          {isSuccess ? "Berhasil!" : "Gagal!"}
        </div>
        
        <div className="text-sm opacity-90">
          {displayMessage}
        </div>
      </div>

      <button
        onClick={(e) => {
          const target = e.currentTarget.parentElement;
          if (target) {
            target.classList.add("animate-out", "fade-out-50", "duration-300");
            setTimeout(() => {
              if (target.parentElement) {
                target.parentElement.removeChild(target);
              }
            }, 300);
          }
        }}
        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        aria-label="Dismiss"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
};

export const SubmitError = ({ error }: { error: string }) => {
  if (!error) return null;
  
  return (
    <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
      <AlertCircle className="h-4 w-4" />
      <span>
        {error}
      </span>
    </div>
  );
};