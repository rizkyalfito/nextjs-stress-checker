"use client";

import { Suspense } from "react";
import Login from "@/components/sign-in";

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}
