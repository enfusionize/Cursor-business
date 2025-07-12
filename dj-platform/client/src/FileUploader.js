import React, { useState } from 'react';

function FileUploader({ onSubmit }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [csvName, setCsvName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);
    const imagePreviews = [];
    let csv = '';
    
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        imagePreviews.push(URL.createObjectURL(file));
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        csv = file.name;
      }
    });
    
    setPreviews(imagePreviews);
    setCsvName(csv);
  };

  const handleInputChange = (e) => {
    handleFileChange(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (onSubmit) onSubmit(formData);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    if (files[index].type === 'text/csv' || files[index].name.endsWith('.csv')) {
      setCsvName('');
    }
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <form onSubmit={handleSubmit}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${isDragOver ? '#667eea' : '#ddd'}`,
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            background: isDragOver ? 'rgba(102, 126, 234, 0.05)' : '#fafafa',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <input
            type="file"
            accept=".csv,image/*"
            multiple
            onChange={handleInputChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          
          <div style={{ pointerEvents: 'none' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: 16,
              color: isDragOver ? '#667eea' : '#ccc'
            }}>
              📁
            </div>
            <h3 style={{ 
              fontSize: '1.3rem', 
              fontWeight: 600, 
              marginBottom: 8,
              color: '#333'
            }}>
              Upload Your Files
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              color: '#666', 
              marginBottom: 16,
              lineHeight: 1.5
            }}>
              Drag & drop your <strong>CSV track database</strong> and <strong>screenshot images</strong> here
              <br />
              <span style={{ fontSize: '0.9rem', color: '#888' }}>
                or click to browse files
              </span>
            </p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 16,
              fontSize: '0.9rem',
              color: '#888'
            }}>
              <div style={{ 
                padding: '8px 16px', 
                background: '#e8f0fe', 
                borderRadius: 20,
                color: '#1976d2'
              }}>
                📊 CSV Files
              </div>
              <div style={{ 
                padding: '8px 16px', 
                background: '#f3e5f5', 
                borderRadius: 20,
                color: '#7b1fa2'
              }}>
                🖼️ Images (JPG, PNG)
              </div>
            </div>
          </div>
        </div>

        {(previews.length > 0 || csvName) && (
          <div style={{ marginTop: 24 }}>
            <h4 style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              marginBottom: 16,
              color: '#333'
            }}>
              📋 Selected Files
            </h4>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 16,
              marginBottom: 24
            }}>
              {previews.map((src, idx) => (
                <div key={idx} style={{ 
                  position: 'relative',
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <img 
                    src={src} 
                    alt="preview" 
                    style={{ 
                      width: 120, 
                      height: 120, 
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {csvName && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: 16,
                  background: '#f8f9fa',
                  borderRadius: 8,
                  border: '1px solid #e9ecef',
                  minWidth: 200
                }}>
                  <div style={{ 
                    fontSize: '2rem', 
                    marginRight: 12,
                    color: '#28a745'
                  }}>
                    📊
                  </div>
                  <div>
                    <div style={{ 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      color: '#333'
                    }}>
                      CSV Database
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#666',
                      marginTop: 2
                    }}>
                      {csvName}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const csvIndex = files.findIndex(f => f.name === csvName);
                      if (csvIndex !== -1) removeFile(csvIndex);
                    }}
                    style={{
                      marginLeft: 'auto',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: '#666',
                      padding: 4
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={files.length === 0}
          style={{
            width: '100%',
            padding: '16px 32px',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: 8,
            background: files.length === 0 
              ? '#ddd' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: files.length === 0 ? '#999' : '#fff',
            border: 'none',
            cursor: files.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: files.length === 0 ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
        >
          {files.length === 0 
            ? '📁 Select files to continue' 
            : `🚀 Analyze ${files.length} file${files.length > 1 ? 's' : ''} with AI`
          }
        </button>
      </form>
    </div>
  );
}

export default FileUploader;