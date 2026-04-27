import React, { useState, useRef } from 'react';
import { uploadFile } from '../api/client';

const UploadPanel = ({ onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'json'].includes(ext)) {
      setError('Only .csv and .json files are supported.');
      return;
    }
    setError(null);
    setFileName(file.name);
    setUploading(true);
    try {
      const data = await uploadFile(file);
      onUpload(data);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };
  const onFileChange = (e) => handleFile(e.target.files[0]);

  return (
    <div className="upload-panel-wrapper">
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !uploading && inputRef.current.click()}
        aria-label="Upload CSV or JSON file"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.json"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />

        <div className="upload-icon-wrap">
          <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        {uploading ? (
          <div className="upload-uploading">
            <div className="spinner" />
            <span>Processing <strong>{fileName}</strong>…</span>
          </div>
        ) : fileName ? (
          <div className="upload-success">
            <span className="checkmark">✓</span>
            <span><strong>{fileName}</strong> uploaded — drop another to replace</span>
          </div>
        ) : (
          <>
            <p className="upload-main-text">
              {dragging ? 'Drop your file here' : 'Drag & drop your dataset'}
            </p>
            <p className="upload-sub-text">or <span className="upload-browse">browse to upload</span></p>
            <p className="upload-formats">Supported: <strong>.csv</strong> · <strong>.json</strong></p>
          </>
        )}
      </div>

      {error && <p className="upload-error">⚠ {error}</p>}
    </div>
  );
};

export default UploadPanel;
