import Features from "@/components/features";
import Hero from "@/components/hero"
import PSSInfo from "@/components/pss-info";

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
      <Hero />
      <PSSInfo />
      <Features />
      </main>
    </>
  );
}
