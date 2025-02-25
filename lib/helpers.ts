import { redirect } from "next/navigation";

export function getIndonesianErrorMessage(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    "Invalid login credentials": "Email atau kata sandi yang Anda masukkan salah",
    "Email not confirmed": "Email belum dikonfirmasi. Silakan cek kotak masuk email Anda",
    "Invalid email or password": "Email atau kata sandi tidak valid",
    "Email already registered": "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda",
    "Password should be at least 6 characters": "Kata sandi harus memiliki minimal 6 karakter",
    "User not found": "Pengguna tidak ditemukan. Periksa email Anda atau daftar terlebih dahulu",
    "Too many requests": "Terlalu banyak percobaan login. Silakan coba lagi nanti",
    "Server error": "Terjadi kesalahan server. Silakan coba lagi nanti"
  };

  return errorMap[errorMessage] || errorMessage;
}

export function encodedRedirect(type: "success" | "error" | "warning" | "email_verification", path: string, message: string) {
  // Encode message untuk aman disertakan dalam URL
  const params = new URLSearchParams({
    type,
    message
  });
  
  return redirect(`${path}?${params.toString()}`);
}