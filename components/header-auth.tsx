import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            disabled
            className="opacity-75 cursor-none pointer-events-none border-violet-600 text-violet-600"
          >
            <Link href="/sign-in">Masuk</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="default"
            disabled
            className="opacity-75 cursor-none pointer-events-none bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Link href="/sign-up">Daftar</Link>
          </Button>
        </div>
      </div>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      Hey, {
        (() => {
          const nameParts = user?.user_metadata?.display_name?.split(" ") || [];
          return nameParts.length > 1 ? nameParts[1] : nameParts[0] || "User";
        })()
      }!
      <form action={signOutAction}>
        <Button type="submit" variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-50">
          Keluar
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-50">
        <Link href="/sign-in">Masuk</Link>
      </Button>
      <Button asChild size="sm" variant="default" className="bg-violet-600 hover:bg-violet-700 text-white">
        <Link href="/sign-up">Daftar</Link>
      </Button>
    </div>
  );
}
