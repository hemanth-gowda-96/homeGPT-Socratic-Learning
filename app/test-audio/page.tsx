'use client';

import { useState } from 'react';

export default function TestAudioPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);
      formData.append('model', 'mistral');
      formData.append('options', JSON.stringify({ temperature: 0.7 }));

      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadResult(result);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({ error: 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Test Audio Upload
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test the new audio generation API endpoint
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {/* File Selection */}
            <div>
              <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700 mb-2">
                Select Audio File
              </label>
              <input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                disabled={loading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
              />
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-600">
                  <p><strong>File:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex space-x-4">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Uploading...' : 'Upload Audio'}
              </button>
              
              <button
                onClick={resetForm}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Results */}
            {uploadResult && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Result:</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  {uploadResult.error ? (
                    <div className="text-red-600">
                      <p><strong>Error:</strong> {uploadResult.error}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <p><strong>Status:</strong> <span className="text-green-600">{uploadResult.message}</span></p>
                      <p><strong>File ID:</strong> {uploadResult.fileId}</p>
                      <p><strong>File Path:</strong> {uploadResult.filePath}</p>
                      <p><strong>Size:</strong> {(uploadResult.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                      <p><strong>MIME Type:</strong> {uploadResult.mimeType}</p>
                      <p><strong>Model:</strong> {uploadResult.model}</p>
                      <p><strong>Uploaded At:</strong> {new Date(uploadResult.uploadedAt).toLocaleString()}</p>
                      <p><strong>Status:</strong> {uploadResult.status}</p>
                    </div>
                  )}
                </div>
                
                {/* Raw JSON Response */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    View Raw Response
                  </summary>
                  <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(uploadResult, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>

        {/* API Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">API Information</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Endpoint:</strong> POST /api/generate-audio</p>
            <p><strong>Supported formats:</strong> WAV, MP3, WebM, OGG, M4A</p>
            <p><strong>Max file size:</strong> 10MB</p>
            <p><strong>Storage:</strong> Temporary folder (temp/)</p>
          </div>
        </div>
      </div>
    </div>
  );
}