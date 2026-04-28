import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { uploadFile } from '../api/client';

const UploadPanel = ({ onUpload }) => {
  const [dragging, setDragging]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName]   = useState(null);
  const [error, setError]         = useState(null);
  const inputRef = useRef(null);

  const processFile = async (file) => {
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
      onUpload(data, file.name);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Upload failed. Please try again.');
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const onDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()  => setDragging(false);
  const onDrop      = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); };
  const onFileChange = (e) => processFile(e.target.files[0]);

  const dropzoneClass = [
    'upload-dropzone',
    dragging  ? 'dragging'  : '',
    uploading ? 'uploading' : '',
  ].join(' ');

  return (
    <div className="card upload-card">
      <div
        className={dropzoneClass}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current.click()}
        onKeyDown={(e) => e.key === 'Enter' && !uploading && inputRef.current.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload CSV or JSON dataset"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.json"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />

        {uploading ? (
          <div className="upload-uploading-state">
            <div className="inline-spinner" />
            <span>Processing <strong>{fileName}</strong>…</span>
          </div>
        ) : fileName ? (
          <div className="upload-success-state">
            <span className="success-ring">✓</span>
            <span><strong>{fileName}</strong> — drop another file to replace</span>
          </div>
        ) : (
          <>
            <div className="upload-icon-ring animate-bounce-slow">
              <UploadCloud />
            </div>
            <p className="upload-title">
              {dragging ? 'Release to upload' : 'Upload Dataset'}
            </p>
            <p className="upload-desc">
              Drag and drop your CSV or JSON file here to begin bias analysis.
              We automatically detect features and potential target variables.
            </p>
            <label
              className="btn-browse"
              onClick={(e) => e.stopPropagation()}
            >
              Browse Files
              <input
                type="file"
                style={{ display: 'none' }}
                accept=".csv,.json"
                onChange={onFileChange}
              />
            </label>
            <p className="upload-formats">Supported formats: <strong>.csv</strong> · <strong>.json</strong></p>
          </>
        )}
      </div>

      {error && <p className="upload-error-msg">⚠ {error}</p>}
    </div>
  );
};

export default UploadPanel;
