"use client";

import { Suspense } from "react";
import Signup from "@/components/sign-up";

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signup />
    </Suspense>
  );
}
