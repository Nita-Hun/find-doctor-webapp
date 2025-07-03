import { useState, useCallback } from 'react';

interface FilePreview {
  name: string;
  type: string;
  size: number;
  url?: string;
  file?: File; // Actual File object for new uploads
  id?: string; // Unique identifier for existing attachments
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  existingAttachments?: FilePreview[];
  onDeleteAttachment?: (id: string) => void;
}

export default function FileUpload({ 
  onFilesChange,
  existingAttachments = [],
  onDeleteAttachment 
}: FileUploadProps) {
  const [previews, setPreviews] = useState<FilePreview[]>(existingAttachments);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        file // Store the actual File object
      }));

      setPreviews(prev => [...prev, ...newFiles]);
      onFilesChange(newFiles.map(f => f.file as File));
    }
  }, [onFilesChange]);

  const handleRemoveFile = useCallback((index: number, id?: string) => {
    if (id && onDeleteAttachment) {
      // Handle deletion of existing attachment
      onDeleteAttachment(id);
    } else {
      // Handle removal of newly uploaded file
      setPreviews(prev => prev.filter((_, i) => i !== index));
      onFilesChange(previews.filter((_, i) => i !== index).map(p => p.file as File));
    }
  }, [previews, onFilesChange, onDeleteAttachment]);

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileChange}
        multiple
      />
      
      <div className="file-previews">
        {previews.map((preview, index) => (
          <div key={preview.id || preview.name} className="file-preview">
            <span>{preview.name}</span>
            <span>{formatFileSize(preview.size)}</span>
            <button onClick={() => handleRemoveFile(index, preview.id)}>
              Remove
            </button>
            {preview.url && (
              <a href={preview.url} target="_blank" rel="noopener noreferrer">
                View
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}