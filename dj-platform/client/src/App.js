import logo from './logo.svg';
import './App.css';
import FileUploader from './FileUploader';

function App() {
  const handleUpload = async (formData) => {
    // Placeholder: send formData to backend and handle response
    alert('Files submitted! (Backend integration needed)');
  };
  return (
    <div className="App" style={{ minHeight: '100vh', background: '#f0f2f5', padding: 32 }}>
      <FileUploader onSubmit={handleUpload} />
    </div>
  );
}

export default App;
