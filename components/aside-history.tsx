import Link from "next/link";

function AsideHistory() {
  return (
    <aside className="w-full md:w-64 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-3">Lihat Riwayat Test Kamu</h2>
      <Link
        href="/protected/history"
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
      >
        Lihat Riwayat
      </Link>
    </aside>
  );
}

export default AsideHistory;