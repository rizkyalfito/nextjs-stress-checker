"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PostgrestError } from "@supabase/supabase-js";


export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const displayName = formData.get("displayName")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect("error", "/sign-up", "Email dan kata sandi diperlukan");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return encodedRedirect("error", "/sign-up", "Format email tidak valid");
  }

  // Password validation
  if (password.length < 6) {
    return encodedRedirect("error", "/sign-up", "Kata sandi minimal harus 6 karakter");
  }

  try {
    // First, check if the email already exists
    // Method 1: Try to get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(email);
    
    // If we found a user, the email is already registered
    if (userData?.user) {
      return encodedRedirect("error", "/sign-up", "Email sudah terdaftar. Silakan gunakan email lain.");
    }

    // If Method 1 doesn't work (e.g., no admin access), try Method 2
    if (userError) {
      // Alternative approach: Try to sign in with a dummy password
      // This will tell us if the user exists without exposing sensitive info
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: "dummy-password-that-will-never-match",
      });

      // If error is "Invalid login credentials", user exists but password is wrong
      // If error is "Email not confirmed", user exists but hasn't confirmed email
      if (signInError && 
         (signInError.message.includes("Invalid login credentials") || 
          signInError.message.includes("Email not confirmed"))) {
        return encodedRedirect("error", "/sign-up", "Email sudah terdaftar. Silakan gunakan email lain.");
      }
    }

    // Proceed with signup
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      // Check specifically for email already registered error
      if (error.message.includes("already registered") || 
          error.message.includes("already exists") || 
          error.message.includes("already taken") ||
          error.status === 400) {
        return encodedRedirect("error", "/sign-up", "Email sudah terdaftar. Silakan gunakan email lain.");
      }
      
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    }

    return encodedRedirect(
      "success",
      "/sign-up",
      "Terima kasih sudah mendaftar! Silakan cek email untuk verifikasi akun"
    );
  } catch (error: any) {
    console.error("Unexpected error during signup:", error);
    return encodedRedirect("error", "/sign-up", "Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  try {
    const email = formData.get("email")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
      return encodedRedirect("error", "/forgot-password", "Email diperlukan");
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
      console.error(error.message);
      return encodedRedirect(
        "error",
        "/forgot-password",
        "Tidak dapat mengatur ulang kata sandi"
      );
    }

    if (callbackUrl) {
      return redirect(callbackUrl);
    }

    return encodedRedirect(
      "success",
      "/forgot-password",
      "Periksa email Anda untuk link reset kata sandi."
    );
  } catch (error) {
    console.error("Server action error:", error);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Terjadi kesalahan saat memproses permintaan Anda"
    );
  }
};
export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


export const saveTestHistoryAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  const userId = formData.get("userId")?.toString();
  const totalScore = formData.get("totalScore");
  const parsedTotalScore = totalScore ? parseInt(totalScore.toString()) : 0;
  const stressLevel = formData.get("stressLevel")?.toString();
  const answers = formData.get("answers")?.toString();

  if (!userId || !totalScore || !stressLevel || !answers) {
    return { error: "Data tidak lengkap" };
  }

  try {
    const { data, error } = await supabase
      .from("history")
      .insert([
        {
          user_id: userId,
          total_score: parsedTotalScore,
          stress_level: stressLevel,
          answer: answers,
        }
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return { error: "Gagal menyimpan hasil tes" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving test history:", error);
    return { error: "Terjadi kesalahan saat menyimpan hasil tes" };
  }
};

export const getTestHistoryAction = async (userId: string) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return { error: "Gagal mengambil riwayat tes" };
    }

    return { data };
  } catch (error) {
    console.error("Error fetching test history:", error);
    return { error: "Terjadi kesalahan saat mengambil riwayat tes" };
  }
};


export const deleteAllTestHistoryAction = async (userId: string) => {
  const supabase = await createClient();

  try {
    // Langkah 1: Hitung jumlah record yang akan dihapus (opsional)
    const { count, error: countError } = await supabase
      .from("history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    
    if (countError) {
      console.error("Error counting records:", countError);
    }
    
    // Langkah 2: Lakukan penghapusan tanpa menggunakan select("count")
    const { error } = await supabase
      .from("history")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Supabase error:", error);
      return { error: "Gagal menghapus riwayat tes", details: error.message };
    }

    console.log(`Berhasil menghapus riwayat tes untuk user ${userId}`);
    return { success: true, count: count || 0 };
  } catch (error: any) {
    console.error("Error deleting test history:", error);
    return { 
      error: "Terjadi kesalahan saat menghapus riwayat tes", 
      details: error.message || String(error) 
    };
  }
};