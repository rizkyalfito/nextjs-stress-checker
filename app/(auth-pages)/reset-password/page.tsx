"use client";

import { Suspense } from "react";
import ResetPassword from "@/components/reset-password";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword searchParams={Promise.resolve(new URLSearchParams())} />
    </Suspense>
  );
}