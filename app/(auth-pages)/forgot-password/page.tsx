import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form className="w-full flex flex-col max-w-md md:min-w-[400px] mx-auto">
        <div>
          <h1 className="text-2xl font-medium">Reset Kata Sandi</h1>
          <p className="text-sm text-secondary-foreground">
            Sudah Punya Akun?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Masuk
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="contoh@email.com" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Atur Ulang Sandi
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      {/* <SmtpMessage /> */}
    </>
  );
}
