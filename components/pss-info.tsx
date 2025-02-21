import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Brain, HeartPulse, Scale, Clock, CheckCircle, BookOpen, ChartBar } from 'lucide-react';
import { JSX } from 'react/jsx-runtime';

export default function PSSInfo(): JSX.Element {
  return (
    <div id='pss-info' className="w-full mx-auto py-8 space-y-12 bg-[url('/bg-intro.jpg')] bg-cover rounded-md">
      {/* Head Info Section */}
      <div className="text-center space-y-4  ">
        <h1 className="text-3xl lg:text-4xl font-bold text-white">Perceived Stress Scale (PSS)</h1>
        <p className="text-l lg:text-xl text-white max-w-3xl mx-auto">
          Ukur dan pahami tingkat stres Anda dengan metode yang telah tervalidasi secara ilmiah dan digunakan di seluruh dunia
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {[
          {
            icon: <Clock className="h-8 w-8 text-violet-600" />,
            title: "Cepat & Efisien",
            description: "Selesaikan tes dalam 5-10 menit"
          },
          {
            icon: <CheckCircle className="h-8 w-8 text-violet-600" />,
            title: "Tervalidasi",
            description: "Digunakan oleh profesional kesehatan mental"
          },
          {
            icon: <BookOpen className="h-8 w-8 text-violet-600" />,
            title: "Mudah Dipahami",
            description: "Pertanyaan sederhana dan langsung"
          },
          {
            icon: <ChartBar className="h-8 w-8 text-violet-600" />,
            title: "Hasil Terukur",
            description: "Dapatkan analisis detail tingkat stres"
          }
        ].map((feature, index) => (
          <Card key={index} className="border-2 hover:border-violet-600 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <div className="mx-auto w-fit p-3 bg-violet-50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}