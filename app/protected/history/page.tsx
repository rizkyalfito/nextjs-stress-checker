import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
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
    <div className="flex-1 w-full flex md:flex-row gap-12">
      <TestHistory />
    </div>
  );
}
