import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

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
      <span className="text-gray-700">
        Hey, {
          (() => {
            const nameParts = user?.user_metadata?.display_name?.split(" ") || [];
            return nameParts.length > 1 ? nameParts[1] : nameParts[0] || "User";
          })()
        }!
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full hover:bg-violet-50 h-10 w-10"
          >
            <User className="h-6 w-6 text-violet-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-violet-200 w-48">
          <DropdownMenuItem className="hover:bg-violet-50 text-gray-700 py-3 text-base">
            <Link href="/protected" className="w-full">Tes</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-violet-50 text-gray-700 py-3 text-base">
            <Link href="/protected/history" className="w-full">Riwayat</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-violet-50 text-gray-700 py-3 text-base">
            <Link href="/protected/result" className="w-full">Hasil Terbaru</Link>
          </DropdownMenuItem>
          <form action={signOutAction} className="w-full">
            <DropdownMenuItem className="hover:bg-violet-50 text-gray-700 cursor-pointer py-3 text-base" asChild>
              <button type="submit" className="w-full text-left">
                Keluar
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
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