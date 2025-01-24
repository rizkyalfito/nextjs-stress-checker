import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="w-full flex flex-col max-w-md md:min-w-[400px] mx-auto">
      <h1 className="text-2xl font-medium">Masuk</h1>
      <p className="text-sm text-foreground">
        Belum punya akun?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Daftar
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="contoh@email.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Kata Sandi</Label>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Kata sandi anda"
          required
        />
          <Link
            className="text-xs text-foreground underline mb-3 text-end"
            href="/forgot-password"
          >
            Lupa Password?
          </Link>
        <SubmitButton pendingText="Masuk..." formAction={signInAction}>
          Masuk
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
