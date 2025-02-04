import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, History, Shield, FileCheck, Users } from 'lucide-react';

const Features = () => {
  const certificationSvg = (
    <svg className="w-full h-48" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="100" y="50" width="200" height="200" rx="10" fill="#E2E8F0"/>
      <circle cx="200" cy="120" r="40" fill="#3B82F6"/>
      <path d="M180 160 L220 160 L200 200 Z" fill="#3B82F6"/>
      <rect x="150" y="80" width="100" height="10" rx="2" fill="#CBD5E1"/>
      <rect x="170" y="100" width="60" height="10" rx="2" fill="#CBD5E1"/>
    </svg>
  );

  const trackingSvg = (
    <svg className="w-full h-48" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,250 L350,250" stroke="#E2E8F0" strokeWidth="2"/>
      <path d="M50,250 L350,100" stroke="#3B82F6" strokeWidth="3"/>
      <circle cx="100" cy="200" r="6" fill="#3B82F6"/>
      <circle cx="175" cy="175" r="6" fill="#3B82F6"/>
      <circle cx="250" cy="150" r="6" fill="#3B82F6"/>
      <circle cx="325" cy="100" r="6" fill="#3B82F6"/>
    </svg>
  );

  const easyUseSvg = (
    <svg className="w-full h-48" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="100" y="70" width="200" height="160" rx="10" fill="#E2E8F0"/>
      <rect x="120" y="90" width="160" height="20" rx="5" fill="#CBD5E1"/>
      <rect x="120" y="120" width="120" height="20" rx="5" fill="#3B82F6"/>
      <circle cx="140" cy="170" r="10" fill="#3B82F6"/>
      <circle cx="180" cy="170" r="10" fill="#CBD5E1"/>
      <circle cx="220" cy="170" r="10" fill="#CBD5E1"/>
    </svg>
  );

  const features = [
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Tersertifikasi & Tervalidasi",
      description: "Telah mendapatkan sertifikasi dan validasi dari badan kesehatan mental terkemuka di Indonesia. Diakui oleh Himpunan Psikologi Indonesia sebagai alat asesmen yang valid dan reliabel.",
      svg: certificationSvg
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: "Cepat & Mudah",
      description: "Proses pengisian kuesioner yang simpel dan dapat diselesaikan dalam 5-10 menit. Dilengkapi dengan panduan yang jelas dan pertanyaan yang mudah dipahami.",
      svg: easyUseSvg
    },
    {
      icon: <History className="h-12 w-12" />,
      title: "Tracking Riwayat",
      description: "Pantau perkembangan tingkat stress Anda melalui riwayat pemeriksaan. Visualisasi grafik memudahkan Anda melihat perubahan tingkat stress dari waktu ke waktu.",
      svg: trackingSvg
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-4">Keunggulan Soulution</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Platform terpercaya untuk memantau kesehatan mental Anda dengan metode yang tervalidasi dan mudah digunakan
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-center mb-4">{feature.title}</h3>
              <p className="text-gray-600 text-center mb-6">{feature.description}</p>
              
              {feature.svg && (
                <div className="mt-6">
                  {feature.svg}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;