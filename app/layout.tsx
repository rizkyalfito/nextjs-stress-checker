import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Pengukur Tingkat Stres",
  // description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center w-full">
            <div className="flex-1 w-full flex flex-col items-center">
              {/* NAVBAR */}
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>Stress Checker</Link>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>

              {/* KONTEN */}
              <div className="flex flex-col gap-10 w-full p-2">
                {children}
              </div>

              <footer className="w-full bg-violet-800 text-white mt-auto justify-center px-20">
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-xl mb-4">Program Kesehatan Mental</h3>
                    <p className="text-sm text-gray-100 mb-4">
                      Layanan pengecekan tingkat stress untuk membantu masyarakat mengenal dan mengelola kondisi kesehatan mental mereka.
                    </p>
                    <div className="flex items-center mt-2">
                      <img src="/ook.WEBP" alt="OK OCE Kemanusiaan" className="h-8 mr-3" />
                      <span className="text-sm font-medium">OK OCE Kemanusiaan</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-xl mb-4">Tautan</h3>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <a href="https://www.okoce.net" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-white hover:underline transition-colors">
                          Website Utama OK OCE Indonesia
                        </a>
                      </li>
                      <li>
                        <a href="https://www.okocekemanusiaan.org" className="text-gray-100 hover:text-white hover:underline transition-colors">
                          Tentang OK OCE Kemanusiaan
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-xl mb-4">Kontak</h3>
                    <p className="text-sm text-gray-100 mb-2">
                      Untuk informasi lebih lanjut:
                    </p>
                    <a href="mailto:info@okoce.id" className="text-sm text-white hover:underline mb-2">
                      info@okoce.id
                    </a>
                    <p className="text-sm text-gray-100">
                      Call Center: 085695761374
                    </p>
                    <div className="flex mt-4 space-x-4">
                      <a href="https://www.facebook.com/p/OKOCEINDONESIA-100064564037361/" target="_blank" rel="noopener noreferrer" aria-label="Facebook OK OCE" className="text-white hover:text-gray-200 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="https://instagram.com/okoce.indonesia" target="_blank" rel="noopener noreferrer" aria-label="Instagram OK OCE" className="text-white hover:text-gray-200 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-violet-500 flex flex-col md:flex-row justify-center items-center ">
                  <div className="flex items-center mb-4 md:mb-0">
                    <img src="/ooi.png" alt="OK OCE Indonesia" className="h-6 mr-3" />
                    <p className="text-xs">
                      © {new Date().getFullYear()} OK OCE Kemanusiaan. Hak Cipta Dilindungi.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
