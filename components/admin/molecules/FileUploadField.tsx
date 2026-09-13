'use client';

import type React from 'react';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAdminStore } from '@/stores/useAdminStore';

export interface FileUploadFieldProps {
  label: string;
  fieldId: string;
  accept?: string;
  currentValue?: string;
  helperText?: string;
  onUploaded: (url: string) => void;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  fieldId,
  accept = 'image/*',
  currentValue,
  helperText,
  onUploaded,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const showToast = useAdminStore((s) => s.showToast);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onUploaded(data.url);
        showToast('success', `File ${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengunggah file');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat upload file');
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  return (
    <div className="admin-form-group">
      <label className="admin-label">{label}</label>
      <div className="admin-upload-wrap">
        <label
          htmlFor={fieldId}
          className={`admin-upload-btn ${isUploading ? 'admin-upload-btn--loading' : ''}`}
        >
          <CloudUploadIcon sx={{ fontSize: 18 }} />
          <span>{isUploading ? 'Mengunggah...' : 'Pilih & Upload File'}</span>
          <input
            id={fieldId}
            type="file"
            accept={accept}
            style={{ display: 'none' }}
            disabled={isUploading}
            onChange={handleFileChange}
          />
        </label>
        {currentValue && (
          <span className="admin-upload-preview-text" title={currentValue}>
            {currentValue.length > 35
              ? `...${currentValue.substring(currentValue.length - 32)}`
              : currentValue}
          </span>
        )}
      </div>
      {helperText && <p className="admin-helper-text">{helperText}</p>}
    </div>
  );
};
