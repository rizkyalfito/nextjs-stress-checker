import React from 'react';
import Link from "next/link";
import { ClockIcon, BarChart2, ArrowRight } from "lucide-react";

// Opsi 1: Card dengan statistik
function AsideHistory() {
  return (
    <aside className="w-full md:w-72 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-100 p-2 rounded-lg">
          <ClockIcon className="w-5 h-5 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold">Riwayat Test</h2>
      </div>
      <p className="text-gray-600 text-sm mb-6">
        Pantau perkembangan tingkat stres kamu dari waktu ke waktu
      </p>
      <Link
        href="/protected/history"
        className="group flex items-center justify-between w-full bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300"
      >
        <span className="font-medium">Lihat Riwayat Test</span>
        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </aside>
  );
}

// Opsi 2: Floating card dengan hover effect
function AsideHistoryOption2() {
  return (
    <aside className="w-full md:w-72 sticky top-4">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-50 p-3 rounded-full mb-4">
            <BarChart2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Riwayat Test</h2>
          <p className="text-gray-600 text-sm mb-6">
            Lihat progress dan hasil test sebelumnya untuk evaluasi diri
          </p>
          <Link
            href="/protected/history"
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 group"
          >
            <span>Lihat Riwayat</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

// Opsi 3: Minimalist card
function AsideHistoryOption3() {
  return (
    <aside className="w-full md:w-64">
      <div className="bg-white rounded-lg p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <ClockIcon className="w-5 h-5 text-red-600" />
          <span className="text-sm text-gray-500">Evaluasi Diri</span>
        </div>
        <h2 className="text-lg font-medium mb-4">Ingin melihat progress kamu?</h2>
        <Link
          href="/protected/history"
          className="block w-full bg-red-50 text-red-600 text-center py-2.5 rounded-md hover:bg-red-100 transition-colors font-medium"
        >
          Lihat Riwayat Test
        </Link>
      </div>
    </aside>
  );
}

export default AsideHistory; // Anda bisa mengexport opsi yang diinginkan