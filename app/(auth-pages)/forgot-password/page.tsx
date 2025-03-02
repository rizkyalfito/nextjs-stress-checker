"use client";

import { Suspense } from "react";
import ForgotPassword from "@/components/forgot-password";

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPassword />
    </Suspense>
  );
}
