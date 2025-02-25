import { signInAction } from "@/app/actions";
import { FormMessage, Message, SubmitError } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { FormInput } from "@/components/input-form";
import Link from "next/link";
import Image from "next/image";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="flex h-screen overflow-hidden rounded-md">
      {/* Left side - Image */}
      <div className="hidden lg:flex rounded-lg lg:w-1/2 bg-gradient-to-b from-violet-50 to-white relative">
        <div className="absolute rounded-md inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="relative rounded-md w-full h-full flex items-center justify-center p-12">
          <Image
            src="/masuk.jpg"
            alt="Login Illustration"
            width={600}
            height={600}
            className="object-contain max-h-[80vh] rounded-md"
            priority
          />
        </div>
      </div>
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Masuk</h1>
            <p className="text-gray-600 mt-2">
              Silakan masuk untuk mengakses semua fitur
            </p>
          </div>
          {/* Display form message at the top if available */}
          <FormMessage message={searchParams} />
          <form className="w-full flex flex-col gap-6" method="post">
            <div className="space-y-4">
              <FormInput
                name="email"
                label="Email"
                type="email"
                placeholder="contoh@email.com"
                required
                validation={{
                  patternString: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", // Changed to string pattern
                  message: "Format email tidak valid"
                }}
              />
              <div className="space-y-1">
                <FormInput
                  name="password"
                  label="Kata Sandi"
                  type="password"
                  placeholder="Kata sandi anda"
                  required
                  minLength={6}
                />
                <Link
                  href="/forgot-password"
                  className="text-sm text-violet-600 hover:text-violet-700 underline block text-right mt-2"
                >
                  Lupa Password?
                </Link>
              </div>
            </div>
            <SubmitButton
              formAction={signInAction}
              pendingText="Masuk..."
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-md transition-colors"
            >
              Masuk
            </SubmitButton>
            <p className="text-center text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-violet-600 hover:text-violet-700 underline"
                >
                Daftar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}