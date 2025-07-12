import logo from './logo.svg';
import './App.css';
import FileUploader from './FileUploader';
import { useState } from 'react';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (formData) => {
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError('Failed to process files.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ minHeight: '100vh', background: '#f0f2f5', padding: 32 }}>
      <FileUploader onSubmit={handleUpload} />
      {loading && <div style={{ marginTop: 24 }}>Processing...</div>}
      {error && <div style={{ color: 'red', marginTop: 24 }}>{error}</div>}
      {results.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3>Results</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#1976d2', color: '#fff' }}>
                <th style={{ padding: 8 }}>File</th>
                <th style={{ padding: 8 }}>OCR Text</th>
                <th style={{ padding: 8 }}>DJ Name</th>
                <th style={{ padding: 8 }}>Track Name</th>
                <th style={{ padding: 8 }}>Purchase Link</th>
                <th style={{ padding: 8 }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{r.file}</td>
                  <td style={{ padding: 8, maxWidth: 200, whiteSpace: 'pre-wrap', fontSize: 12 }}>{r.ocrText}</td>
                  <td style={{ padding: 8 }}>{r.match?.['DJ Name'] || '-'}</td>
                  <td style={{ padding: 8 }}>{r.match?.['Name of the Tracks'] || '-'}</td>
                  <td style={{ padding: 8 }}>
                    {r.match?.['Link to Purchase Track'] ? (
                      <a href={r.match['Link to Purchase Track']} target="_blank" rel="noopener noreferrer">Buy</a>
                    ) : '-'}
                  </td>
                  <td style={{ padding: 8 }}>{r.match?.['Price per Track'] || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
