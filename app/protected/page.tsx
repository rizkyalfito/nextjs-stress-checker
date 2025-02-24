import Questions from "@/components/questions";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col md:flex-row gap-12">
      <div className="flex-1">
        <div className="bg-yellow-300 opacity-65 text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
           Pastikan kamu dalam posisi yang nyaman ya, Selamat mengisi! 
        </div>
        <div className="flex flex-col gap-2 items-start mt-4">
          <Questions />
        </div>
      </div>
    </div>
  );
}
