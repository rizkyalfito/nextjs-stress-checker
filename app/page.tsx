import About from "@/components/about";
import Features from "@/components/features";
import Hero from "@/components/hero"
import PSSInfo from "@/components/pss-info";

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-10">
      <Hero />
      <PSSInfo />
      <About/>
      <Features />
      </main>
    </>
  );
}
