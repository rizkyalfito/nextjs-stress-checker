import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen justify-center p-4">
        <div className="w-full max-w-full">
          <FormMessage message={searchParams} />
        </div>
      </div>
    );
  }

  return (
    <>
      <form className="w-full flex flex-col max-w-md md:min-w-[400px] mx-auto" method="post">
        <h1 className="text-2xl font-medium">Daftar</h1>
        <p className="text-sm text text-foreground">
          Sudah punya akun?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Masuk
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="contoh@email.com" required />
          <Label htmlFor="displayName">Nama</Label>
          <Input name="displayName" placeholder="Nama anda" required />
          <Label htmlFor="password">Kata Sandi</Label>
          <Input
            type="password"
            name="password"
            placeholder="Buat kata sandi"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Mendaftar...">
            Daftar
          </SubmitButton>
          <FormMessage message={searchParams}  />
        </div>
      </form>
      {/* <SmtpMessage /> */}
    </>
  );
}
