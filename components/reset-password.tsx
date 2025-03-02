import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<URLSearchParams>;
}) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Atur ulang sandi</h1>
        <p className="text-gray-500">Silakan masukan kata sandi baru anda</p>
      </div>
      
      <form action={resetPasswordAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Kata Sandi Baru</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
        </div>
        
        <FormMessage message={{
          type: undefined,
          message: undefined
        }} />
        
        <SubmitButton className="w-full">Atur Ulang</SubmitButton>
      </form>
    </div>
  );
}