import React, { useState } from 'react';

function FileUploader({ onSubmit }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [csvName, setCsvName] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const imagePreviews = [];
    let csv = '';
    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        imagePreviews.push(URL.createObjectURL(file));
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        csv = file.name;
      }
    });
    setPreviews(imagePreviews);
    setCsvName(csv);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '2px dashed #aaa', padding: 24, borderRadius: 8, textAlign: 'center', background: '#fafafa' }}>
      <h2>Upload CSV or Image Files</h2>
      <input
        type="file"
        accept=".csv,image/*"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
        {previews.map((src, idx) => (
          <img key={idx} src={src} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', margin: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        ))}
        {csvName && (
          <div style={{ margin: 8, padding: 8, border: '1px solid #ccc', borderRadius: 4, background: '#fff' }}>
            <span role="img" aria-label="csv">📄</span> {csvName}
          </div>
        )}
      </div>
      <button type="submit" style={{ padding: '8px 24px', fontSize: 16, borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Submit
      </button>
    </form>
  );
}

export default FileUploader;