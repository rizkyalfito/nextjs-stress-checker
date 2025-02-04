import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Brain, HeartPulse, Scale, Clock, CheckCircle, BookOpen, ChartBar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PSSInfo = () => {
  return (
    <div id='pss-info' className="max-w-7xl mx-auto py-8 space-y-12">
      {/* Head Info Section */}
      <div className="text-center space-y-4 px-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary">Perceived Stress Scale (PSS)</h1>
        <p className="text-l lg:text-xl text-gray-600 max-w-3xl mx-auto">
          Ukur dan pahami tingkat stres Anda dengan metode yang telah tervalidasi secara ilmiah dan digunakan di seluruh dunia
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {[
          {
            icon: <Clock className="h-8 w-8 text-primary" />,
            title: "Cepat & Efisien",
            description: "Selesaikan tes dalam 5-10 menit"
          },
          {
            icon: <CheckCircle className="h-8 w-8 text-primary" />,
            title: "Tervalidasi",
            description: "Digunakan oleh profesional kesehatan mental"
          },
          {
            icon: <BookOpen className="h-8 w-8 text-primary" />,
            title: "Mudah Dipahami",
            description: "Pertanyaan sederhana dan langsung"
          },
          {
            icon: <ChartBar className="h-8 w-8 text-primary" />,
            title: "Hasil Terukur",
            description: "Dapatkan analisis detail tingkat stres"
          }
        ].map((feature, index) => (
          <Card key={index} className="border-2 hover:border-primary transition-all duration-300">
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <div className="mx-auto w-fit p-3 bg-primary/10 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* About PSS Section */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="text-2xl">Tentang PSS</CardTitle>
          <CardDescription>Memahami Perceived Stress Scale</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Apa itu PSS?</h3>
            <p className="text-gray-600 leading-relaxed">
              PSS adalah instrumen standar yang dikembangkan oleh Sheldon Cohen untuk mengukur tingkat stres yang dirasakan dalam kehidupan seseorang. Metode ini telah divalidasi dan digunakan secara luas dalam penelitian psikologi dan kesehatan mental.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Keunggulan PSS:</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Validitas tinggi dan reliabel</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Dapat digunakan untuk berbagai kelompok usia</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Hasil dapat diinterpretasi dengan mudah</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-secondary p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold">Versi PSS yang Tersedia</h3>
            <div className="space-y-4">
              {[
                { name: 'PSS-14', items: 14, desc: 'Versi lengkap untuk hasil yang detail' },
                { name: 'PSS-10', items: 10, desc: 'Versi yang paling umum digunakan' },
                { name: 'PSS-4', items: 4, desc: 'Versi singkat untuk penilaian cepat' }
              ].map((version, index) => (
                <div key={index} className="bg-background p-4 rounded-lg">
                  <h4 className="font-semibold text-primary">{version.name}</h4>
                  <p className="text-sm text-gray-600">{version.desc}</p>
                  <div className="mt-2 h-2 bg-primary/20 rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${(version.items / 14) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <div className="mx-4">
        <h2 className="text-2xl font-semibold mb-6">Manfaat Penggunaan PSS</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Brain className="h-6 w-6 text-primary" />,
              title: "Pemahaman Diri",
              description: "Mengetahui tingkat stres dan pola respon terhadap tekanan"
            },
            {
              icon: <HeartPulse className="h-6 w-6 text-primary" />,
              title: "Kesehatan Mental",
              description: "Deteksi dini potensi masalah kesehatan mental"
            },
            {
              icon: <Scale className="h-6 w-6 text-primary" />,
              title: "Evaluasi Berkala",
              description: "Pantau perubahan tingkat stres dari waktu ke waktu"
            }
          ].map((benefit, index) => (
            <Card key={index} className="border-none bg-secondary">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PSSInfo;