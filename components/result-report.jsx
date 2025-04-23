// components/ResultReport.jsx
import React from 'react';

const ResultReport = ({ testData, formattedDate, formattedTime }) => {
  const getStressLevelClass = (level) => {
    switch(level) {
      case 'Rendah': return 'low';
      case 'Sedang': return 'medium';
      case 'Tinggi': return 'high';
      default: return 'medium';
    }
  };

  const levelClass = getStressLevelClass(testData.stress_level);
  const scorePercentage = (testData.total_score / 40) * 100;

  return (
    <div className="pdf-container">
      <style jsx>{`
        /* Paste all CSS styles from my previous response here */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        /* ... rest of the CSS ... */
      `}</style>

      <div className="container">
        {/* Header with logos */}
        <div className="header">
          <div className="logo-container">
            <img src="/ook.WEBP" alt="OK OCE Kemanusiaan Logo" className="logo" />
            <img src="/ooi.png" alt="OK OCE Indonesia Logo" className="logo" />
          </div>
          <h1 className="title">HASIL TES TINGKAT STRES</h1>
          <h3 className="subtitle">Program Kesehatan Mental OK OCE Kemanusiaan</h3>
          
          <div className="date-time">
            <div className="date-time-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{formattedDate}</span>
            </div>
            <div className="date-time-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="score-container">
          <div className="score-card">
            <div className={`score-circle ${levelClass}`}>
              <div className={`score-circle-inner ${levelClass}`}>
                <div className={`score-circle-core ${levelClass}-bg`}>
                  <span>{testData.total_score}</span>
                </div>
              </div>
            </div>
            <h2>Tingkat Stres</h2>
            <span className={`stress-level ${levelClass}`}>{testData.stress_level}</span>
          </div>
        </div>
        
        <div className="analysis">
          <div className="analysis-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h3>Analisis Skor</h3>
          </div>
          
          <div className="score-bar-container">
            <div className="score-bar-header">
              <span>Skor Anda</span>
              <span><strong>{testData.total_score}/40</strong></span>
            </div>
            <div className="score-bar-bg">
              <div className={`score-bar ${levelClass}-bg`} style={{ width: `${scorePercentage}%` }}></div>
            </div>
          </div>
          
          <div className={`description-box ${levelClass}`}>
            <p className={`${levelClass}-text`}>
              {testData.stress_level === 'Rendah' && 
                'Tingkat stres Anda berada dalam kategori rendah. Tetap jaga pola hidup sehat dan kelola stres dengan baik.'}
              {testData.stress_level === 'Sedang' && 
                'Tingkat stres Anda berada dalam kategori sedang. Perhatikan faktor pemicu stres dan terapkan teknik relaksasi.'}
              {testData.stress_level === 'Tinggi' && 
                'Tingkat stres Anda berada dalam kategori tinggi. Disarankan untuk berkonsultasi dengan profesional kesehatan mental.'}
            </p>
          </div>
          
          <div className="categories">
            <div className="category low">
              <div className="low-text">
                <strong>Rendah</strong>
              </div>
              <div className="low-text">
                0-13
              </div>
            </div>
            <div className="category medium">
              <div className="medium-text">
                <strong>Sedang</strong>
              </div>
              <div className="medium-text">
                14-26
              </div>
            </div>
            <div className="category high">
              <div className="high-text">
                <strong>Tinggi</strong>
              </div>
              <div className="high-text">
                27-40
              </div>
            </div>
          </div>
          
          <div className="disclaimer">
            <h4>Penting Diketahui</h4>
            <p>
              Hasil tes ini dapat menjadi langkah awal untuk menyadari kondisi mental Anda terhadap stres, namun tidak dapat menggantikan diagnosa atau rekomendasi profesional dari psikolog atau tenaga kesehatan mental. Jika Anda mengalami gejala stres yang berlangsung lama atau menganggu aktivitas sehari-hari, segera konsultasikan dengan tenaga profesional kesehatan mental.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="footer">
          <p>
            © {new Date().getFullYear()} OK OCE Kemanusiaan - Program Kesehatan Mental<br />
            Di bawah naungan OK OCE Indonesia<br />
            Dokumen ini dihasilkan secara otomatis dan bersifat rahasia.
          </p>
        </div>
        
        {/* Watermark */}
        <img src="/ook.WEBP" alt="Watermark" className="watermark" />
      </div>
    </div>
  );
};

export default ResultReport;