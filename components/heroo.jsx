import Image from "next/image";
import Link from "next/link";

export default function Herop() {
  return (
    <section className="relative flex flex-col items-center justify-center h-screen text-center px-6 bg-gradient-to-b from-blue-500 to-blue-900">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/ook.WEBP"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-30"
        />
      </div>

      {/* Content */}
      <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
        Welcome to <span className="text-yellow-300">Soulution</span>
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
        A stress checker that helps you understand and manage your mental well-being.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex gap-4">
        <Link href="/check">
          <button className="px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition">
            Check
          </button>
        </Link>
        <Link href="/learn-more">
          <button className="px-6 py-3 text-lg font-semibold text-white bg-transparent border border-white rounded-md hover:bg-white hover:text-blue-900 transition">
            Learn More
          </button>
        </Link>
      </div>
    </section>
  );
}
