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
    <div className="App" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: 32,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        padding: 32,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <header style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8
          }}>
            � Dimensionaleyezed Data Center
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#666', 
            maxWidth: 600, 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            AI-Powered DJ & Music Management Platform
            <br />
            <span style={{ fontSize: '0.9rem', color: '#888' }}>
              Upload images and CSV files to automatically identify tracks, find purchase links, and manage your music library
            </span>
          </p>
        </header>

        <FileUploader onSubmit={handleUpload} />
        
        {loading && (
          <div style={{ 
            marginTop: 24, 
            textAlign: 'center',
            padding: 20,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 8,
            fontSize: '1.1rem'
          }}>
            🔄 Processing your files with AI-powered OCR and track matching...
          </div>
        )}
        
        {error && (
          <div style={{ 
            color: '#dc3545', 
            marginTop: 24, 
            textAlign: 'center',
            padding: 16,
            background: '#fff5f5',
            borderRadius: 8,
            border: '1px solid #fecaca'
          }}>
            ❌ {error}
          </div>
        )}
        
        {results.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              marginBottom: 16,
              color: '#333'
            }}>
              � Track Identification Results
            </h3>
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: '#fff' 
                  }}>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>📁 File</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>🔍 OCR Text</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>🎧 DJ Name</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>🎵 Track Name</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>🛒 Purchase</th>
                    <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>💰 Price</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => (
                    <tr key={idx} style={{ 
                      borderBottom: '1px solid #f0f0f0',
                      '&:hover': { background: '#f8f9fa' }
                    }}>
                      <td style={{ padding: '12px', fontSize: '0.9rem', fontWeight: 500 }}>{r.file}</td>
                      <td style={{ 
                        padding: '12px', 
                        maxWidth: 200, 
                        whiteSpace: 'pre-wrap', 
                        fontSize: '0.8rem',
                        color: '#666',
                        lineHeight: 1.4
                      }}>
                        {r.ocrText.length > 100 ? r.ocrText.substring(0, 100) + '...' : r.ocrText}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 500 }}>
                        {r.match?.['DJ Name'] || <span style={{ color: '#999' }}>-</span>}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 500 }}>
                        {r.match?.['Name of the Tracks'] || <span style={{ color: '#999' }}>-</span>}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {r.match?.['Link to Purchase Track'] ? (
                          <a 
                            href={r.match['Link to Purchase Track']} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: 6,
                              textDecoration: 'none',
                              fontSize: '0.85rem',
                              fontWeight: 500
                            }}
                          >
                            🛒 Buy Now
                          </a>
                        ) : <span style={{ color: '#999' }}>-</span>}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 600, color: '#667eea' }}>
                        {r.match?.['Price per Track'] || <span style={{ color: '#999' }}>-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ 
              marginTop: 16, 
              padding: 16, 
              background: '#f8f9fa', 
              borderRadius: 8,
              textAlign: 'center',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              💡 <strong>Pro Tip:</strong> Results are automatically sent to your n8n workflow for further automation (notifications, library updates, etc.)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
