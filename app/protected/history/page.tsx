import Questions from "@/components/questions";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import AsideHistory from "@/components/aside-history";
import TestHistory from "@/components/histories";

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row gap-12">
      <TestHistory />
    </div>
  );
}
