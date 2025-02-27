'use client'

import React, { useEffect, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Definisi tipe untuk toast
export type ToastType = "success" | "error" | null;

const toastVariants = cva(
  "fixed z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg max-w-md transition-all duration-300",
  {
    variants: {
      variant: {
        success: "bg-green-50 border border-green-200 text-green-700",
        error: "bg-red-50 border border-red-200 text-red-700",
      },
      position: {
        topRight: "top-4 right-4",
        topCenter: "top-4 left-1/2 -translate-x-1/2",
        bottomRight: "bottom-4 right-4",
        bottomCenter: "bottom-4 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      variant: "success",
      position: "topRight",
    },
  }
);

export interface ToastProps extends VariantProps<typeof toastVariants> {
  message?: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Toast = ({
  message,
  variant,
  position,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}: ToastProps) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isVisible && autoClose) {
      timeoutId = setTimeout(() => {
        onClose();
      }, duration);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible || !message) return null;

  return (
    <div
      className={cn(
        toastVariants({ variant, position }),
        isVisible
          ? "animate-in fade-in slide-in-from-top-5"
          : "animate-out fade-out slide-out-to-top-5"
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      {variant === "success" ? (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      )}
      
      <div className="flex-1">
        <p className="font-medium">
          {variant === "success" ? "Berhasil!" : "Gagal!"}
        </p>
        <p className="text-sm">{message}</p>
      </div>
      
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600"
        aria-label="Tutup"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Hook untuk mengelola toast berdasarkan URL search params
export const useToast = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
    visible: boolean;
  }>({
    type: null,
    message: "",
    visible: false,
  });

  // Fungsi untuk mendapatkan pesan yang lebih ramah untuk pengguna
  const getUserFriendlyErrorMessage = (errorMessage: string) => {
    const errorMap: Record<string, string> = {
      "Email and password are required": "Email dan kata sandi diperlukan untuk mendaftar",
      "Invalid login credentials": "Email atau kata sandi yang Anda masukkan salah",
      "Email already registered": "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda",
      "User not found": "Pengguna tidak ditemukan. Periksa email Anda atau daftar terlebih dahulu",
      "Email not confirmed": "Email belum dikonfirmasi. Silakan cek kotak masuk email Anda",
      "Password should be at least 6 characters": "Kata sandi harus memiliki minimal 6 karakter",
    };

    return errorMap[errorMessage] || errorMessage;
  };

  useEffect(() => {
    const type = searchParams.get("type") as ToastType;
    const message = searchParams.get("message");

    if (type && message) {
      setToast({
        type,
        message: getUserFriendlyErrorMessage(decodeURIComponent(message)),
        visible: true,
      });
      
      // Bersihkan URL tanpa memuat ulang halaman
      const params = new URLSearchParams(searchParams);
      params.delete("type");
      params.delete("message");
      const newUrl = pathname + (params.toString() ? `?${params.toString()}` : "");
      router.replace(newUrl);
    }
  }, [searchParams, router, pathname]);

  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const showToast = (type: ToastType, message: string) => {
    setToast({
      type,
      message: getUserFriendlyErrorMessage(message),
      visible: true,
    });
  };

  return {
    toast,
    closeToast,
    showToast,
  };
};

// Komponen ToastProvider untuk digunakan di layout
export const ToastProvider = () => {
  const { toast, closeToast } = useToast();
  
  return (
    <Toast
      message={toast.message}
      variant={toast.type || undefined}
      position="topCenter"
      isVisible={toast.visible}
      onClose={closeToast}
    />
  );
};