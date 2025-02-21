import { CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

export default function About() {
  return ( // Tambahkan return di sini
    <Card className="min-w-full">
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
          <div className="bg-violet-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Keunggulan PSS:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-violet-600" />
                <span>Validitas tinggi dan reliabel</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-violet-600" />
                <span>Dapat digunakan untuk berbagai kelompok usia</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-violet-600" />
                <span>Hasil dapat diinterpretasi dengan mudah</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-violet-50 p-6 rounded-lg space-y-4">
          <h3 className="text-xl font-semibold">Perbandingan Versi PSS</h3>
          <div className="space-y-4">
            {[
              { name: 'PSS-14', items: 14, desc: 'Versi awal (jarang digunakan)', active: false },
              { name: 'PSS-10', items: 10, desc: 'Versi yang digunakan dalam sistem ini', active: true },
              { name: 'PSS-4', items: 4, desc: 'Versi singkat (kurang komprehensif)', active: false }
            ].map((version, index) => (
              <div key={index} className={`bg-white p-4 rounded-lg ${version.active ? 'border-2 border-violet-600' : ''}`}>
                <h4 className={`font-semibold ${version.active ? 'text-violet-600' : 'text-gray-600'}`}>
                  {version.name} {version.active && <span className="text-sm">(Digunakan)</span>}
                </h4>
                <p className="text-sm text-gray-600">{version.desc}</p>
                <div className="mt-2 h-2 bg-violet-100 rounded-full">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${version.active ? 'bg-violet-600' : 'bg-violet-300'}`}
                    style={{ width: `${(version.items / 14) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
