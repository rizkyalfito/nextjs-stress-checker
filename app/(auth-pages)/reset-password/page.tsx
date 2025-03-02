import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Atur ulang sandi</h1>
      <p className="text-sm text-foreground/60">
        Silakan masukan kata sandi baru anda
      </p>
      <Label htmlFor="password">Kata Sandi Baru</Label>
      <Input
        type="password"
        name="password"
        placeholder="Kata sandi baru"
        required
      />
      <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Konfirmasi kata sandi"
        required
      />
      <SubmitButton formAction={resetPasswordAction}>
        Atur Ulang
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
