import React from 'react';
import { FormMessage, Message } from "@/components/form-message";
import { AlertTriangle, Mail } from "lucide-react";
import Link from "next/link";

// Komponen baru untuk menampilkan pesan status autentikasi dengan UI yang lebih baik
export const AuthStatusMessage = ({ message }: { message: Message }) => {
  if (!message || !message.message) {
    return null;
  }

  // Specific error messages we want to enhance with special UI
  const isInvalidCredentials = message.message.includes("Email atau kata sandi yang Anda masukkan tidak sesuai") || 
                               message.message.includes("Invalid login credentials") ||
                               message.message.includes("Kata sandi yang Anda masukkan salah");
                               
  const isUnverifiedEmail = message.message.includes("Email belum dikonfirmasi") || 
                            message.message.includes("Email not confirmed");
                            
  const isUserNotFound = message.message.includes("Email tidak ditemukan") || 
                         message.message.includes("User not found");

  // If it's one of our special cases, use enhanced UI
  if (isInvalidCredentials || isUnverifiedEmail || isUserNotFound) {
    return (
      <div className="mb-6 animate-in fade-in-50 duration-300">
        {isInvalidCredentials && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-700">Gagal Masuk</h3>
                <p className="text-sm text-red-600 mt-1">
                  Email atau kata sandi yang Anda masukkan tidak sesuai. Mohon periksa kembali.
                </p>
                <div className="mt-3 rounded-md bg-white/50 p-3 border border-red-100">
                  <div className="flex items-center gap-2 text-sm text-red-800">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <span className="text-xs font-medium">!</span>
                    </span>
                    <p>Pastikan Caps Lock tidak aktif dan periksa ejaan dengan teliti.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isUnverifiedEmail && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-700">Email Belum Diverifikasi</h3>
                <p className="text-sm text-amber-600 mt-1">
                  Anda perlu memverifikasi email sebelum dapat masuk. Silakan cek kotak masuk email Anda.
                </p>
                <div className="mt-3 flex flex-col space-y-2">
                  <div className="rounded-md bg-white/50 p-3 border border-amber-100">
                    <div className="flex items-center gap-2 text-sm text-amber-800">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                        <span className="text-xs">1</span>
                      </span>
                      <p>Cek folder spam jika email verifikasi tidak ditemukan</p>
                    </div>
                  </div>
                  <button
                    className="self-start mt-2 text-sm font-medium text-violet-600 hover:text-violet-700 underline"
                    type="button"
                  >
                    Kirim Ulang Email Verifikasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isUserNotFound && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-700">Email Tidak Ditemukan</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Email yang Anda masukkan belum terdaftar dalam sistem kami.
                </p>
                <div className="mt-3 flex flex-row space-x-3">
                  <Link 
                    href="/sign-up" 
                    className="text-sm px-3 py-1.5 rounded-md bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
                  >
                    Daftar Sekarang
                  </Link>
                  <button
                    className="text-sm px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    type="button"
                  >
                    Coba Email Lain
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Use the default FormMessage for other messages
  return <FormMessage message={message} />;
};