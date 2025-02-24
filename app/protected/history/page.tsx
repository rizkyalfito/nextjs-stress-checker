import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TestHistory from "@/components/histories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TestHistory />
      </div>
    </div>
  );
}